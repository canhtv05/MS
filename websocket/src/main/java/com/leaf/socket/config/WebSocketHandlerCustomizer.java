package com.leaf.socket.config;

import static com.leaf.socket.service.WebsocketSessionManager.*;

import com.leaf.common.socket.WsMessage;
import com.leaf.common.socket.WsMessageProtoMapper;
import com.leaf.framework.blocking.util.CommonUtils;
import com.leaf.socket.service.WebSocketService;
import com.leaf.socket.service.WebsocketSessionManager;
import java.io.IOException;
import java.nio.ByteBuffer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketHandlerCustomizer extends BinaryWebSocketHandler {

    private final WebsocketSessionManager sessionManager;
    private final WebSocketService webSocketService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String userId = (String) session.getAttributes().get(WS_ATTRIBUTE_USER_ID);
        String tokenSessionId = (String) session.getAttributes().get(WS_ATTRIBUTE_TOKEN_ID);
        String channelType = (String) session.getAttributes().get(WS_ATTRIBUTE_CHANNEL_TYPE);
        boolean wasAlreadyOnline = CommonUtils.isNotEmpty(userId) && sessionManager.isUserOnline(userId);
        sessionManager.addSession(session);
        if (CommonUtils.isNotEmpty(userId) && !wasAlreadyOnline) {
            webSocketService.broadcastPresence(userId, true);
        }
        log.info(
            "[WS] WebSocket connected: userId={}, tokenSession={}, channelType={}, sessionId={}",
            userId,
            tokenSessionId,
            channelType,
            session.getId()
        );
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String userId = (String) session.getAttributes().get(WS_ATTRIBUTE_USER_ID);
        String tokenSessionId = (String) session.getAttributes().get(WS_ATTRIBUTE_TOKEN_ID);
        String channelType = (String) session.getAttributes().get(WS_ATTRIBUTE_CHANNEL_TYPE);
        sessionManager.removeSession(session);
        if (CommonUtils.isNotEmpty(userId) && !sessionManager.isUserOnline(userId)) {
            webSocketService.broadcastPresence(userId, false);
        }
        log.info(
            "[WS] WebSocket disconnected: userId={}, tokenSession={}, channelType={}, sessionId={}",
            userId,
            tokenSessionId,
            channelType,
            session.getId()
        );
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) {
        String userId = (String) session.getAttributes().get(WS_ATTRIBUTE_USER_ID);
        String channelType = (String) session.getAttributes().get(WS_ATTRIBUTE_CHANNEL_TYPE);
        try {
            ByteBuffer buf = message.getPayload();
            byte[] bytes = new byte[buf.remaining()];
            buf.duplicate().get(bytes);
            WsMessage payload = WsMessageProtoMapper.fromByteArray(bytes);
            sessionManager.updateLastActivity(session);
            if (CommonUtils.isEmpty(payload) || CommonUtils.isEmpty(payload.getType())) {
                log.info(
                    "[WS] Received from userId={} channelType={} sessionId={} invalid or empty type",
                    userId,
                    channelType,
                    session.getId()
                );
                sendError(session, "Message invalid!");
                return;
            }
            log.info(
                "[WS] Received from userId={} channelType={} sessionId={} type={}",
                userId,
                channelType,
                session.getId(),
                payload.getType()
            );
            webSocketService.handleMessage(session, payload);
        } catch (Exception e) {
            log.error(
                "[WS] handleBinaryMessage userId={} channelType={} sessionId={} error={}",
                userId,
                channelType,
                session.getId(),
                e.getMessage(),
                e
            );
            try {
                sendError(session, e.getMessage());
            } catch (IOException ignored) {
                //
            }
        }
    }

    private void sendError(WebSocketSession session, String message) throws IOException {
        session.sendMessage(new BinaryMessage(WsMessageProtoMapper.toByteArray(WsMessage.error(message))));
    }
}
