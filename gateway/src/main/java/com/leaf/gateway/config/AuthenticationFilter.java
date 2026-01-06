package com.leaf.gateway.config;

import com.leaf.common.dto.ResponseObject;
import com.leaf.common.enums.AuthKey;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.utils.JsonF;
import com.leaf.framework.constant.CommonConstants;
import com.leaf.gateway.grpc.GrpcAuthClient;
import io.micrometer.common.util.StringUtils;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Value("${app.api-prefix}")
    private String API_PREFIX;

    @Override
    public int getOrder() {
        return -1;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("GATEWAY_DEBUG: Request URI: " + exchange.getRequest().getURI());
        log.info("GATEWAY_DEBUG: Request Path: " + exchange.getRequest().getURI().getPath());

        List<String> authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION);
        String token = null;
        if (CollectionUtils.isEmpty(authHeader)) {
            HttpCookie cookie = exchange.getRequest().getCookies().getFirst(CommonConstants.COOKIE_NAME);
            log.info("GATEWAY_DEBUG: No auth header, checking cookie: " + (cookie != null ? "found" : "not found"));
            if (Objects.nonNull(cookie)) {
                String decoded = URLDecoder.decode(cookie.getValue(), StandardCharsets.UTF_8);
                @SuppressWarnings("unchecked")
                Map<String, String> tokenData = JsonF.jsonToObject(decoded, Map.class);
                if (!CollectionUtils.isEmpty(tokenData)) {
                    token = tokenData.get(AuthKey.ACCESS_TOKEN.getKey());
                }
            }
        } else {
            token = authHeader.getFirst().replace("Bearer ", "");
            log.info("GATEWAY_DEBUG: Auth header found");
        }

        if (isPublicEndpoint(exchange.getRequest())) {
            log.info("GATEWAY_DEBUG: Public endpoint - allowing through");
            if (StringUtils.isNotBlank(token)) {
                log.info("GATEWAY_DEBUG: Forwarding token to downstream service");
                ServerHttpRequest request = exchange
                    .getRequest()
                    .mutate()
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                    .build();
                return chain.filter(exchange.mutate().request(request).build());
            }
            return chain.filter(exchange);
        }

        log.info("GATEWAY_DEBUG: Protected endpoint - checking auth");

        if (StringUtils.isBlank(token)) {
            log.info("GATEWAY_DEBUG: No token found - returning 401");
            return unauthenticated(exchange.getResponse());
        }

        final String finalToken = token;
        return grpcAuthClient
            .verifyToken(finalToken)
            .flatMap(verifyTokenResponseApiResponse -> {
                if (Boolean.TRUE.equals(verifyTokenResponseApiResponse.getValid())) {
                    ServerHttpRequest request = exchange
                        .getRequest()
                        .mutate()
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + finalToken)
                        .build();
                    return chain.filter(exchange.mutate().request(request).build());
                } else {
                    return unauthenticated(exchange.getResponse());
                }
            })
            .onErrorResume(throwable -> {
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
}
