package com.leaf.framework.reactive.util;

import com.leaf.common.enums.TokenStatus;
import com.leaf.common.utils.AESUtils;
import com.leaf.framework.config.ApplicationProperties;
import com.leaf.framework.constant.CommonConstants;
import com.leaf.framework.reactive.cache.ReactiveRedisCacheService;
import com.leaf.framework.reactive.service.ReactiveSessionStore;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import java.util.Objects;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

/**
 * Reactive version of JwtUtil for use in reactive contexts (e.g., Spring Cloud
 * Gateway).
 * Wraps blocking JWT operations in reactive Mono.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ReactiveJwtUtil {

    private final ApplicationProperties applicationProperties;
    private final ReactiveRedisCacheService redisService;
    private final ReactiveSessionStore keyCacheService;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(applicationProperties.getSecurity().getBase64Secret());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Mono<Claims> parseToken(String token) {
        return Mono.fromCallable(() -> {
            return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
        }).subscribeOn(Schedulers.boundedElastic());
    }

    public Mono<TokenStatus> validateToken(String authToken) {
        return parseToken(authToken)
            .flatMap(claims -> {
                String username = claims.getSubject();
                String channel = claims.get(CommonConstants.CHANNEL_KEY, String.class);

                Date expiration = claims.getExpiration();

                if (expiration.before(new Date())) {
                    return Mono.just(TokenStatus.EXPIRED);
                }

                return keyCacheService
                    .getKeyToken(username, channel)
                    .flatMap(keyToken -> redisService.get(keyToken, String.class))
                    .map(tokenExisting -> {
                        log.info("Token existing: {}", tokenExisting);
                        log.info("Auth token hex: {}", AESUtils.hexString(authToken));
                        if (Objects.equals(tokenExisting, AESUtils.hexString(authToken))) {
                            return TokenStatus.VALID;
                        } else {
                            return TokenStatus.INVALID;
                        }
                    })
                    .defaultIfEmpty(TokenStatus.INVALID);
            })
            .onErrorResume(e -> {
                if (e instanceof ExpiredJwtException) {
                    return Mono.just(TokenStatus.EXPIRED);
                } else if (e instanceof JwtException || e instanceof IllegalArgumentException) {
                    return Mono.just(TokenStatus.INVALID);
                }
                log.error("Error validating token: {}", e.getMessage(), e);
                return Mono.just(TokenStatus.INVALID);
            });
    }
}
