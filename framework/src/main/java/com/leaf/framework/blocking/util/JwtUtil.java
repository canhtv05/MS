package com.leaf.framework.blocking.util;

import com.leaf.common.enums.TokenStatus;
import com.leaf.common.utils.AESUtils;
import com.leaf.framework.blocking.config.cache.RedisCacheService;
import com.leaf.framework.blocking.service.SessionStore;
import com.leaf.framework.config.ApplicationProperties;
import com.leaf.framework.constant.CommonConstants;
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

/**
 * Blocking version of JwtUtil for use in blocking contexts (e.g., Spring MVC).
 * For reactive contexts (e.g., Spring Cloud Gateway), use ReactiveJwtUtil
 * instead.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtUtil {

    private final ApplicationProperties applicationProperties;
    private final RedisCacheService redisService;
    private final SessionStore keyCacheService;

    public SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(applicationProperties.getSecurity().getBase64Secret());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public Claims parseToken(String token) {
        return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
    }

    public TokenStatus validateToken(String authToken) {
        try {
            Claims claims = parseToken(authToken);
            String username = claims.getSubject();
            String channel = claims.get(CommonConstants.CHANNEL_KEY, String.class);

            Date expiration = claims.getExpiration();

            if (expiration.before(new Date())) {
                return TokenStatus.EXPIRED;
            }

            String keyToken = keyCacheService.getKeyToken(username, channel);
            String tokenExisting = redisService.get(keyToken, String.class);
            log.info("Token existing: {}", tokenExisting);
            log.info("Auth token hex: {}", AESUtils.hexString(authToken));
            if (Objects.equals(tokenExisting, AESUtils.hexString(authToken))) {
                return TokenStatus.VALID;
            } else {
                return TokenStatus.INVALID;
            }
        } catch (ExpiredJwtException e) {
            return TokenStatus.EXPIRED;
        } catch (JwtException | IllegalArgumentException e) {
            return TokenStatus.INVALID;
        }
    }
}
