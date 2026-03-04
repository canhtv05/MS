package com.leaf.socket.service;

import com.leaf.common.socket.WsMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketService {

    private final WebsocketSessionManager wsSessionManager;

    public void handleMessage(WebSocketSession session, WsMessage payload) {}

    public void sendToUser(String userId, String message) {
        WsMessage payload = WsMessage.builder().type(WsMessage.WsType.MESSAGE).message(message).build();
        wsSessionManager.sendToUser(userId, payload);
        log.info("[WebSocketService] Sent to user: {} with message: {}", userId, message);
    }

    public void sendToUser(String userId, WsMessage payload) {
        wsSessionManager.sendToUser(userId, payload);
        log.info("[WebSocketService] Sent to user: {} with payload: {}", userId, payload);
    }

    public void sendToAll(String message) {
        WsMessage payload = WsMessage.builder().type(WsMessage.WsType.MESSAGE).message(message).build();
        wsSessionManager.send(payload);
        log.info("[WebSocketService] Sent to all with message: {}", message);
    }
}
