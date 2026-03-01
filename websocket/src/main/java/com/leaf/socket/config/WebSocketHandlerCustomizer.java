package com.leaf.socket.config;

import static com.leaf.socket.service.WebsocketSessionManager.*;

import com.leaf.common.socket.WsMessage;
import com.leaf.common.utils.CommonUtils;
import com.leaf.common.utils.JsonF;
import com.leaf.socket.service.WebSocketService;
import com.leaf.socket.service.WebsocketSessionManager;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketHandlerCustomizer extends TextWebSocketHandler {

    private final WebsocketSessionManager sessionManager;
    private final WebSocketService webSocketService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String userId = (String) session.getAttributes().get(WS_ATTRIBUTE_USER_ID);
        String tokenSessionId = (String) session.getAttributes().get(WS_ATTRIBUTE_TOKEN_ID);
        String channelType = (String) session.getAttributes().get(WS_ATTRIBUTE_CHANNEL_TYPE);
        sessionManager.addSession(session);
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
        log.info(
            "[WS] WebSocket disconnected: userId={}, tokenSession={}, channelType={}, sessionId={}",
            userId,
            tokenSessionId,
            channelType,
            session.getId()
        );
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        String userId = (String) session.getAttributes().get(WS_ATTRIBUTE_USER_ID);
        String channelType = (String) session.getAttributes().get(WS_ATTRIBUTE_CHANNEL_TYPE);
        String msgData = message.getPayload();
        try {
            WsMessage payload = JsonF.jsonToObject(msgData, WsMessage.class);
            if (CommonUtils.isEmpty(payload) || CommonUtils.isEmpty(payload.getType())) {
                log.info(
                    "[WS] Received from userId={} channelType={} sessionId={} message: {}",
                    userId,
                    channelType,
                    session,
                    msgData
                );
                session.sendMessage(new TextMessage(JsonF.toJson(WsMessage.error("Message invalid!"))));
                log.error(
                    "Response from userId={} channelType={} message: {}",
                    userId,
                    channelType,
                    "Message invalid!"
                );
                return;
            }
            String logMsg = String.format(
                "[WS] Received from userId=%s channelType=%s sessionId=%s message: %s",
                userId,
                channelType,
                session.getId(),
                msgData
            );
            log.info(logMsg);
            webSocketService.handleMessage(session, payload);
        } catch (Exception e) {
            String logMsg = String.format(
                "[WS] handleTextMessage userId=%s channelType=%s sessionId=%s error=%s",
                userId,
                channelType,
                session.getId(),
                e.getMessage()
            );
            log.error(logMsg, e);
            try {
                session.sendMessage(new TextMessage(JsonF.toJson(WsMessage.error(e.getMessage()))));
            } catch (IOException ex) {
                //
            }
        } finally {
            MDC.clear();
        }
    }
}
