package com.leaf.gateway.config;

import com.leaf.common.constant.CommonConstants;
import com.leaf.common.dto.ResponseObject;
import com.leaf.common.enums.AuthKey;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.utils.JsonF;
import com.leaf.gateway.grpc.GrpcAuthClient;
import io.micrometer.common.util.StringUtils;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
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
import org.springframework.util.CollectionUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
@Order(Ordered.HIGHEST_PRECEDENCE)
public class AuthenticationFilter implements GlobalFilter, Ordered {

    private final GrpcAuthClient grpcAuthClient;

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

        List<String> authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION);
        String token = null;
        if (CollectionUtils.isEmpty(authHeader) || Objects.isNull(authHeader)) {
            HttpCookie cookie = exchange
                .getRequest()
                .getCookies()
                .getFirst(CommonConstants.COOKIE_NAME);
            if (Objects.nonNull(cookie)) {
                String decoded = URLDecoder.decode(cookie.getValue(), StandardCharsets.UTF_8);
                Map<String, String> tokenData = JsonF.jsonToObject(decoded, Map.class);
                if (!CollectionUtils.isEmpty(tokenData)) {
                    token = tokenData.get(AuthKey.ACCESS_TOKEN.getKey());
                }
            }
        } else {
            token = authHeader.getFirst().replace("Bearer ", "");
        }

        if (StringUtils.isBlank(token)) {
            return unauthenticated(exchange.getResponse());
        }

        return grpcAuthClient
            .verifyToken(token)
            .flatMap(verifyTokenResponseApiResponse -> {
                if (Boolean.TRUE.equals(verifyTokenResponseApiResponse.getValid())) {
                    return chain.filter(exchange);
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
        return Arrays.stream(CommonConstants.PREFIX_PUBLIC_ENDPOINTS).anyMatch(s ->
            path.matches(API_PREFIX + s)
        );
    }

    Mono<Void> unauthenticated(ServerHttpResponse response) {
        ResponseObject<?> responseMap = ResponseObject.error(ErrorMessage.UNAUTHENTICATED);
        String body = JsonF.toJson(responseMap);

        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        return response.writeWith(Mono.just(response.bufferFactory().wrap(body.getBytes())));
    }
}
