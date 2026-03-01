package com.leaf.socket.config;

import static com.leaf.socket.service.WebsocketSessionManager.*;

import com.leaf.common.utils.AESUtils;
import com.leaf.common.utils.CommonUtils;
import com.leaf.framework.blocking.util.JwtUtil;
import com.leaf.framework.constant.CommonConstants;
import io.jsonwebtoken.Claims;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

@Component
@RequiredArgsConstructor
public class WebsocketInterceptorCustomizer implements HandshakeInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public boolean beforeHandshake(
        ServerHttpRequest request,
        ServerHttpResponse response,
        WebSocketHandler wsHandler,
        Map<String, Object> attributes
    ) {
        String token = "";
        List<String> authHeader = request.getHeaders().get(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && !authHeader.isEmpty()) {
            String header = authHeader.getFirst();
            if (header.startsWith("Bearer ")) {
                token = header.substring(7);
            }
        }

        if (CommonUtils.isNotEmpty(token)) {
            Claims claims = jwtUtil.parseToken(token);
            String username = claims.getSubject();
            String channel = claims.get(CommonConstants.CHANNEL_KEY, String.class);
            attributes.put(WS_ATTRIBUTE_USER_ID, username);
            attributes.put(WS_ATTRIBUTE_TOKEN_ID, AESUtils.hexString(token));
            attributes.put(WS_ATTRIBUTE_CHANNEL_TYPE, channel);
        }
        return true;
    }

    @Override
    public void afterHandshake(
        ServerHttpRequest request,
        ServerHttpResponse response,
        WebSocketHandler wsHandler,
        Exception exception
    ) {}
}
