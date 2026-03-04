package com.leaf.socket.config;

import static com.leaf.socket.service.WebsocketSessionManager.*;

import com.leaf.common.dto.TokenPairDTO;
import com.leaf.framework.blocking.util.CommonUtil;
import com.leaf.framework.blocking.util.FwUtil;
import com.leaf.framework.blocking.util.JwtUtil;
import com.leaf.framework.constant.CommonConstants;
import io.jsonwebtoken.Claims;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebsocketInterceptorCustomizer implements HandshakeInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public boolean beforeHandshake(
        ServerHttpRequest request,
        ServerHttpResponse response,
        WebSocketHandler wsHandler,
        Map<String, Object> attributes
    ) {
        try {
            String token = null;

            List<String> authHeader = request.getHeaders().get(HttpHeaders.AUTHORIZATION);
            if (authHeader != null && !authHeader.isEmpty()) {
                String header = authHeader.getFirst();
                if (header != null && header.startsWith("Bearer ")) {
                    token = header.substring(7).trim();
                }
            }

            if (CommonUtil.isEmpty(token)) {
                Optional<TokenPairDTO> tokenPair = CommonUtil.tokenFromCookie(
                    request.getHeaders().getFirst(HttpHeaders.COOKIE)
                );
                token = tokenPair.get().getAccessToken();
                if (CommonUtil.isNotEmpty(token)) {
                    setAttributes(attributes, token);
                }
            } else {
                setAttributes(attributes, token);
            }

            return true;
        } catch (Exception e) {
            log.warn("[WS] beforeHandshake failed, allowing anonymous: {}", e.getMessage());
            return true;
        }
    }

    @Override
    public void afterHandshake(
        ServerHttpRequest request,
        ServerHttpResponse response,
        WebSocketHandler wsHandler,
        Exception exception
    ) {}

    private void setAttributes(Map<String, Object> attributes, String token) {
        Claims claims = jwtUtil.parseToken(token);
        String username = claims.getSubject();
        String channel = claims.get(CommonConstants.CHANNEL_KEY, String.class);
        attributes.put(WS_ATTRIBUTE_USER_ID, username);
        attributes.put(WS_ATTRIBUTE_TOKEN_ID, FwUtil.hexString(token));
        attributes.put(WS_ATTRIBUTE_CHANNEL_TYPE, channel != null ? channel : "web");
    }
}
