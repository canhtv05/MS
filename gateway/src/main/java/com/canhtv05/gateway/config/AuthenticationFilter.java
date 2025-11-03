package com.canhtv05.gateway.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.server.ServerWebExchange;

import com.canhtv05.common.exceptions.ErrorMessage;
import com.canhtv05.common.exceptions.ResponseObject;
import com.canhtv05.common.utils.JsonF;
import com.canhtv05.gateway.grpc.GrpcAuthClient;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
@Order(Ordered.HIGHEST_PRECEDENCE)
public class AuthenticationFilter implements GlobalFilter, Ordered {

	private final GrpcAuthClient grpcAuthClient;

	String[] PUBLIC_ENDPOINTS = { "/auth/authenticate" };

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
		if (CollectionUtils.isEmpty(authHeader)) {
			return unauthenticated(exchange.getResponse());
		}

		String token = authHeader.get(0).replace("Bearer ", "");
		// if (StringUtils.isBlank(token)) {
		// HttpCookie cookie =
		// exchange.getRequest().getCookies().getFirst(ConstantCookie.COOKIE_NAME);
		// // if (cookie != null) {
		// // token = cookie.getValue();
		// // }
		// System.out.println(cookie);
		// }

		return grpcAuthClient.verifyToken(token).flatMap(verifyTokenResponseApiResponse -> {
			if (Boolean.TRUE.equals(verifyTokenResponseApiResponse.getValid())) {
				return chain.filter(exchange);
			} else {
				return unauthenticated(exchange.getResponse());
			}
		}).onErrorResume(throwable -> {
			return unauthenticated(exchange.getResponse());
		});
	}

	private boolean isPublicEndpoint(ServerHttpRequest endpoint) {
		return Arrays.stream(PUBLIC_ENDPOINTS)
				.anyMatch(s -> endpoint.getURI().getPath().matches(API_PREFIX + s));
	}

	Mono<Void> unauthenticated(ServerHttpResponse response) {
		ResponseObject<?> responseMap = ResponseObject.error(ErrorMessage.UNAUTHENTICATED);
		String body = JsonF.toJson(responseMap);

		response.setStatusCode(HttpStatus.UNAUTHORIZED);
		response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

		return response.writeWith(
				Mono.just(response.bufferFactory().wrap(body.getBytes())));
	}
}
