package com.leaf.socket.service;

import com.leaf.common.socket.WsMessage;
import com.leaf.common.socket.WsMessageProtoMapper;
import com.leaf.framework.blocking.util.JsonF;
import com.leaf.socket.dto.UserOnlineStatusDTO;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.WebSocketSession;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketService {

    public static final String PRESENCE_TOPIC_PREFIX = "presence:";
    private final WebsocketSessionManager wsSessionManager;

    public void handleMessage(WebSocketSession session, WsMessage payload) {
        switch (payload.getType()) {
            case PING:
                sendToSession(session, WsMessage.builder().type(WsMessage.WsType.PONG).build());
                break;
            case CHECK_USER_ONLINE:
                String targetUserId = StringUtils.defaultString(payload.getUserId());
                if (StringUtils.isBlank(targetUserId)) return;
                boolean online = wsSessionManager.isUserOnline(targetUserId);
                String dataJson = JsonF.toJson(
                    UserOnlineStatusDTO.builder().userId(targetUserId).online(online).build()
                );
                var type = online ? WsMessage.WsType.USER_ONLINE : WsMessage.WsType.USER_OFFLINE;
                sendToSession(session, WsMessage.builder().type(type).userId(targetUserId).data(dataJson).build());
                break;
            case SUBSCRIBE:
                wsSessionManager.subscribe(session, payload.getTopic());
                break;
            case UNSUBSCRIBE:
                wsSessionManager.unsubscribe(session, payload.getTopic());
                break;
            default:
                break;
        }
    }

    public void broadcastPresence(String userId, boolean online) {
        if (StringUtils.isBlank(userId)) return;
        String topic = PRESENCE_TOPIC_PREFIX + userId;
        WsMessage.WsType type = online ? WsMessage.WsType.USER_ONLINE : WsMessage.WsType.USER_OFFLINE;
        WsMessage msg = WsMessage.builder().type(type).userId(userId).data(userId).build();
        wsSessionManager.sendToTopic(topic, msg);
        log.debug("[WebSocketService] presence -> topic {} userId={} online={}", topic, userId, online);
    }

    private void sendToSession(WebSocketSession session, WsMessage msg) {
        try {
            session.sendMessage(new BinaryMessage(WsMessageProtoMapper.toByteArray(msg)));
        } catch (IOException e) {
            log.warn("[WebSocketService] sendToSession failed: {}", e.getMessage());
        }
    }

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

    public void sendToTopic(String topic, WsMessage payload) {
        wsSessionManager.sendToTopic(topic, payload);
        log.info("[WebSocketService] Sent to topic: {} with payload: {}", topic, payload);
    }
}
