package com.leaf.gateway.config;

import com.leaf.common.dto.ResponseObject;
import com.leaf.common.enums.AuthKey;
import com.leaf.common.enums.TokenStatus;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.utils.CommonUtils;
import com.leaf.common.utils.JsonF;
import com.leaf.framework.config.ApplicationProperties;
import com.leaf.framework.constant.CommonConstants;
import com.leaf.framework.reactive.util.ReactiveJwtUtil;
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
    private final ReactiveJwtUtil jwtUtil;

    @Value("${app.api-prefix}")
    private String API_PREFIX;

    @Override
    public int getOrder() {
        return -1;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        boolean isPublic = isPublicEndpoint(request);
        boolean isGraphql = isGraphqlEndpoint(request);

        if (isPublic) {
            return chain.filter(exchange);
        }
        if (isGraphql) {
            return handleOptionalAuthentication(exchange, chain);
        }

        return handleRequiredAuthentication(exchange, chain);
    }

    private boolean isPublicEndpoint(ServerHttpRequest request) {
        String path = request.getURI().getPath();

        return Arrays.stream(CommonConstants.PREFIX_PUBLIC_ENDPOINTS).anyMatch(s -> {
            String pattern = API_PREFIX + s;
            return pathMatcher.match(pattern, path);
        });
    }

    private boolean isGraphqlEndpoint(ServerHttpRequest request) {
        String path = request.getURI().getPath();

        return Arrays.stream(CommonConstants.PREFIX_GRAPHQL_PUBLIC_ENDPOINTS).anyMatch(s -> {
            String pattern = API_PREFIX + s;
            return pathMatcher.match(pattern, path);
        });
    }

    private Mono<Void> handleRequiredAuthentication(ServerWebExchange exchange, GatewayFilterChain chain) {
        TokenPair tokens = resolveTokens(exchange, false);
        String accessToken = tokens.accessToken();
        String refreshToken = tokens.refreshToken();

        String channelFromHeader = exchange.getRequest().getHeaders().getFirst("X-Channel");
        final String finalChannel = CommonUtils.getSafeObject(channelFromHeader, String.class, "web");

        if (StringUtils.isEmpty(accessToken)) {
            if (StringUtils.isEmpty(refreshToken)) {
                return unauthenticated(exchange.getResponse());
            }

            return refreshAndContinueRequired(exchange, chain, refreshToken, finalChannel);
        }

        final String finalAccessToken = accessToken;

        return jwtUtil
            .validateToken(finalAccessToken)
            .flatMap(status -> {
                if (status.equals(TokenStatus.VALID)) {
                    var request = addAuthHeader(exchange.getRequest(), finalAccessToken);
                    return chain.filter(exchange.mutate().request(request).build());
                }
                if (status.equals(TokenStatus.EXPIRED)) {
                    if (StringUtils.isEmpty(refreshToken)) {
                        return unauthenticated(exchange.getResponse());
                    }
                    return refreshAndContinueRequired(exchange, chain, refreshToken, finalChannel);
                }
                return unauthenticated(exchange.getResponse());
            })
            .onErrorResume(e -> {
                log.error("Error validating token", e);
                return unauthenticated(exchange.getResponse());
            });
    }

    private Mono<Void> handleOptionalAuthentication(ServerWebExchange exchange, GatewayFilterChain chain) {
        TokenPair tokens = resolveTokens(exchange, true);
        String accessToken = tokens.accessToken();
        String refreshToken = tokens.refreshToken();

        log.info("Access token: {}", accessToken);
        log.info("Refresh token: {}", refreshToken);

        String channelFromHeader = exchange.getRequest().getHeaders().getFirst("X-Channel");
        final String finalChannel = CommonUtils.getSafeObject(channelFromHeader, String.class, "web");

        if (StringUtils.isEmpty(accessToken)) {
            if (StringUtils.isEmpty(refreshToken)) {
                return chain.filter(exchange);
            }

            return refreshAndContinueOptional(exchange, chain, refreshToken, finalChannel);
        }

        final String finalAccessToken = accessToken;

        return jwtUtil
            .validateToken(finalAccessToken)
            .flatMap(status -> {
                if (status.equals(TokenStatus.VALID)) {
                    var request = addAuthHeader(exchange.getRequest(), finalAccessToken);
                    return chain.filter(exchange.mutate().request(request).build());
                }
                if (status.equals(TokenStatus.EXPIRED)) {
                    if (StringUtils.isEmpty(refreshToken)) {
                        return chain.filter(exchange);
                    }
                    return refreshAndContinueOptional(exchange, chain, refreshToken, finalChannel);
                }

                return chain.filter(exchange);
            })
            .onErrorResume(e -> {
                log.error("Error validating token for GraphQL", e);
                return chain.filter(exchange);
            });
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
            ResponseCookie cookie = cookieBuilder.build();
            response.addCookie(cookie);
        } catch (Exception e) {
            log.error("Failed to add auth cookie", e);
        }
    }

    private ServerHttpRequest addAuthHeader(ServerHttpRequest request, String accessToken) {
        return request.mutate().header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken).build();
    }

    private TokenPair resolveTokens(ServerWebExchange exchange, boolean isGraphql) {
        List<String> authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION);
        String accessToken = null;
        String refreshToken = null;

        if (CollectionUtils.isEmpty(authHeader)) {
            HttpCookie cookie = exchange.getRequest().getCookies().getFirst(CommonConstants.COOKIE_NAME);
            if (Objects.nonNull(cookie)) {
                try {
                    String decoded = URLDecoder.decode(cookie.getValue(), StandardCharsets.UTF_8);
                    @SuppressWarnings("unchecked")
                    Map<String, String> tokenData = JsonF.jsonToObject(decoded, Map.class);
                    if (!CollectionUtils.isEmpty(tokenData)) {
                        accessToken = tokenData.get(AuthKey.ACCESS_TOKEN.getKey());
                        refreshToken = tokenData.get(AuthKey.REFRESH_TOKEN.getKey());
                    }
                } catch (Exception e) {
                    if (isGraphql) {
                        log.error("Error decoding auth cookie for GraphQL", e);
                    } else {
                        log.error("Error decoding auth cookie", e);
                    }
                }
            }
        } else {
            accessToken = authHeader.getFirst().replace("Bearer ", "");
        }

        return new TokenPair(accessToken, refreshToken);
    }

    private Mono<Void> refreshAndContinueRequired(
        ServerWebExchange exchange,
        GatewayFilterChain chain,
        String refreshToken,
        String channel
    ) {
        return grpcAuthClient
            .refreshToken(refreshToken, channel)
            .flatMap(refreshResult -> {
                if (Objects.isNull(refreshResult)) {
                    return unauthenticated(exchange.getResponse());
                }
                var request = addAuthHeader(exchange.getRequest(), refreshResult.getAccessToken());
                addAuthCookie(exchange.getResponse(), refreshResult.getAccessToken(), refreshResult.getRefreshToken());
                return chain.filter(exchange.mutate().request(request).build());
            })
            .onErrorResume(e -> unauthenticated(exchange.getResponse()));
    }

    private Mono<Void> refreshAndContinueOptional(
        ServerWebExchange exchange,
        GatewayFilterChain chain,
        String refreshToken,
        String channel
    ) {
        return grpcAuthClient
            .refreshToken(refreshToken, channel)
            .flatMap(refreshResult -> {
                if (Objects.isNull(refreshResult)) {
                    return chain.filter(exchange);
                }
                var request = addAuthHeader(exchange.getRequest(), refreshResult.getAccessToken());
                addAuthCookie(exchange.getResponse(), refreshResult.getAccessToken(), refreshResult.getRefreshToken());
                return chain.filter(exchange.mutate().request(request).build());
            })
            .onErrorResume(e -> chain.filter(exchange));
    }

    private record TokenPair(String accessToken, String refreshToken) {}
}
