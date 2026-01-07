package com.leaf.gateway.config;

import com.leaf.common.dto.ResponseObject;
import com.leaf.common.enums.AuthKey;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.utils.CommonUtils;
import com.leaf.common.utils.JsonF;
import com.leaf.framework.config.ApplicationProperties;
import com.leaf.framework.constant.CommonConstants;
import com.leaf.gateway.grpc.GrpcAuthClient;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.CollectionUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Slf4j
@Component
@RequiredArgsConstructor
@Order(Ordered.HIGHEST_PRECEDENCE)
public class AuthenticationFilter implements GlobalFilter, Ordered {

    private final GrpcAuthClient grpcAuthClient;
    private final ApplicationProperties applicationProperties;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Value("${app.api-prefix}")
    private String API_PREFIX;

    @Override
    public int getOrder() {
        return -1;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        if (isPublicEndpoint(exchange.getRequest())) {
            return chain.filter(exchange);
        }

        log.info("GATEWAY_DEBUG: Request URI: " + exchange.getRequest().getURI());
        log.info("GATEWAY_DEBUG: Request Path: " + exchange.getRequest().getURI().getPath());

        List<String> authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION);
        String accessToken = null;
        String refreshToken = null;
        if (CollectionUtils.isEmpty(authHeader)) {
            HttpCookie cookie = exchange.getRequest().getCookies().getFirst(CommonConstants.COOKIE_NAME);
            log.info("GATEWAY_DEBUG: No auth header, checking cookie: " + (cookie != null ? "found" : "not found"));
            if (Objects.nonNull(cookie)) {
                String decoded = URLDecoder.decode(cookie.getValue(), StandardCharsets.UTF_8);
                @SuppressWarnings("unchecked")
                Map<String, String> tokenData = JsonF.jsonToObject(decoded, Map.class);
                if (!CollectionUtils.isEmpty(tokenData)) {
                    accessToken = tokenData.get(AuthKey.ACCESS_TOKEN.getKey());
                    refreshToken = tokenData.get(AuthKey.REFRESH_TOKEN.getKey());
                }
            }
        } else {
            accessToken = authHeader.getFirst().replace("Bearer ", "");
            log.info("GATEWAY_DEBUG: Auth header found");
        }

        log.info("GATEWAY_DEBUG: Protected endpoint - checking auth");

        if (StringUtils.isEmpty(accessToken)) {
            log.info("GATEWAY_DEBUG: No token found - returning 401");
            return unauthenticated(exchange.getResponse());
        }

        final String finalAccessToken = accessToken;
        final String finalRefreshToken = refreshToken;
        String channelFromHeader = exchange.getRequest().getHeaders().getFirst("X-Channel");
        final String finalChannel = CommonUtils.getSafeObject(channelFromHeader, String.class, "web");
        return grpcAuthClient
            .verifyToken(finalAccessToken, finalRefreshToken, finalChannel)
            .flatMap(verifyTokenResponseApiResponse -> {
                var verifyTokenResponse = verifyTokenResponseApiResponse;
                log.info("GATEWAY_DEBUG: Token verification result - valid: " + verifyTokenResponse.getValid());
                if (Boolean.TRUE.equals(verifyTokenResponse.getValid())) {
                    String accessTokenForward = StringUtils.defaultString(
                        StringUtils.isNoneEmpty(verifyTokenResponse.getAccessToken())
                            ? verifyTokenResponse.getAccessToken()
                            : finalAccessToken
                    );
                    String refreshTokenForward = StringUtils.defaultString(
                        StringUtils.isNoneEmpty(verifyTokenResponse.getRefreshToken())
                            ? verifyTokenResponse.getRefreshToken()
                            : finalRefreshToken
                    );

                    ServerHttpRequest request = exchange
                        .getRequest()
                        .mutate()
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessTokenForward)
                        .build();
                    ServerWebExchange newExchange = exchange.mutate().request(request).build();
                    if (!accessTokenForward.equals(finalAccessToken)) {
                        log.info("GATEWAY_DEBUG: Token refreshed, updating cookie");
                        addAuthCookie(newExchange.getResponse(), accessTokenForward, refreshTokenForward);
                    }
                    log.info("GATEWAY_DEBUG: Forwarding request to downstream service");
                    return chain.filter(newExchange);
                } else {
                    log.info("GATEWAY_DEBUG: Token verification failed - valid=false");
                    return unauthenticated(exchange.getResponse());
                }
            })
            .onErrorResume(throwable -> {
                log.error("GATEWAY_DEBUG: Error during token verification", throwable);
                return unauthenticated(exchange.getResponse());
            });
    }

    private boolean isPublicEndpoint(ServerHttpRequest request) {
        String path = request.getURI().getPath();
        log.info("GATEWAY_DEBUG: Checking if public - path: " + path);
        log.info("GATEWAY_DEBUG: API_PREFIX: " + API_PREFIX);

        boolean isPublic = Arrays.stream(CommonConstants.PREFIX_PUBLIC_ENDPOINTS).anyMatch(s -> {
            String pattern = API_PREFIX + s;
            boolean matches = pathMatcher.match(pattern, path);
            log.info("GATEWAY_DEBUG: Pattern: " + pattern + " matches: " + matches);
            return matches;
        });

        log.info("GATEWAY_DEBUG: Final result: " + isPublic);
        return isPublic;
    }

    Mono<Void> unauthenticated(ServerHttpResponse response) {
        ResponseObject<?> responseMap = ResponseObject.error(ErrorMessage.UNAUTHENTICATED);
        String body = JsonF.toJson(responseMap);

        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        response.getCookies().remove(CommonConstants.COOKIE_NAME);

        return response.writeWith(Mono.just(response.bufferFactory().wrap(body.getBytes())));
    }

    private void addAuthCookie(ServerHttpResponse response, String accessToken, String refreshToken) {
        try {
            Map<String, String> tokens = new HashMap<>();
            tokens.put(AuthKey.ACCESS_TOKEN.getKey(), CommonUtils.getSafeObject(accessToken, String.class, ""));
            tokens.put(AuthKey.REFRESH_TOKEN.getKey(), CommonUtils.getSafeObject(refreshToken, String.class, ""));
            String tokenData = JsonF.toJson(tokens);
            String encoded = URLEncoder.encode(tokenData, StandardCharsets.UTF_8);

            String domain = applicationProperties.getSecurity().getCookieDomain();
            ResponseCookie.ResponseCookieBuilder cookieBuilder = ResponseCookie.from(
                CommonConstants.COOKIE_NAME,
                encoded
            )
                .httpOnly(true)
                .maxAge(applicationProperties.getSecurity().getRefreshDurationInSeconds())
                .path("/")
                .secure(false)
                .sameSite("Strict");
            if (StringUtils.isNotEmpty(domain)) cookieBuilder.domain(domain);
            response.addCookie(cookieBuilder.build());
        } catch (Exception e) {
            log.error("GATEWAY_DEBUG: Failed to add auth cookie", e);
        }
    }
}
