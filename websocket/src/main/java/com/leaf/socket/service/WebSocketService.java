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
    }
}
