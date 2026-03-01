package com.leaf.socket.service;

import com.leaf.common.socket.WsMessage;
import com.leaf.common.socket.WsSessionRevokedMessage;
import com.leaf.common.utils.JsonF;
import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

@Component
@Slf4j
public class WebsocketSessionManager {

    public static final String WS_ATTRIBUTE_USER_ID = "userId";
    public static final String WS_ATTRIBUTE_TOKEN_ID = "tokenId";
    public static final String WS_ATTRIBUTE_CHANNEL_TYPE = "channelType";

    /** Key for sessions without token (ConcurrentHashMap does not allow null key). */
    private static final String ANONYMOUS_USER_KEY = "__anonymous__";

    private final ConcurrentHashMap<String, Set<WebSocketSession>> userSessions = new ConcurrentHashMap<>();

    public void addSession(WebSocketSession session) {
        String userId = (String) session.getAttributes().get(WS_ATTRIBUTE_USER_ID);
        String tokenSessionId = (String) session.getAttributes().get(WS_ATTRIBUTE_TOKEN_ID);
        String channelType = (String) session.getAttributes().get(WS_ATTRIBUTE_CHANNEL_TYPE);
        String mapKey = userId != null ? userId : ANONYMOUS_USER_KEY;
        log.info(
            "[WS] addSession userId={} tokenId={} channelType={} with sessionId={}",
            userId,
            tokenSessionId,
            channelType,
            session.getId()
        );
        userSessions.computeIfAbsent(mapKey, k -> ConcurrentHashMap.newKeySet()).add(session);
        log.info("[WS] after addSession for user={} total session online: {}", mapKey, userSessions.get(mapKey).size());
    }

    public void removeSession(WebSocketSession session) {
        String userId = (String) session.getAttributes().get(WS_ATTRIBUTE_USER_ID);
        String tokenSessionId = (String) session.getAttributes().get(WS_ATTRIBUTE_TOKEN_ID);
        String channelType = (String) session.getAttributes().get(WS_ATTRIBUTE_CHANNEL_TYPE);
        String mapKey = userId != null ? userId : ANONYMOUS_USER_KEY;
        userSessions.computeIfPresent(mapKey, (uid, sessions) -> {
            sessions.remove(session);
            log.info(
                "[WS] removeSession userId={} tokenId={} channelType={} with sessionId={}",
                uid,
                tokenSessionId,
                channelType,
                session.getId()
            );
            if (sessions.isEmpty()) {
                log.info("[WS] all sessions closed for userId={}, removing user from map", uid);
                return null;
            }
            log.info("[WS] after removeSession userId={} remainingSessions={}", uid, userSessions.get(uid).size());
            return sessions;
        });
    }

    public void closeCurrentSessionsOfUser(String userId, WsSessionRevokedMessage payload, WsMessage msg) {
        log.info("[WS] closeCurrentSessionsOfUser userId={} ...", userId);
        Set<WebSocketSession> sessions = userSessions.get(userId);
        if (ObjectUtils.isEmpty(sessions)) {
            log.info("[WS] closeCurrentSessionsOfUser userId={} not found session!", userId);
            return;
        }
        for (WebSocketSession s : sessions) {
            String tokenSessionId = (String) s.getAttributes().get(WS_ATTRIBUTE_TOKEN_ID);
            String channelType = (String) s.getAttributes().get(WS_ATTRIBUTE_CHANNEL_TYPE);
            if (
                payload.getChannelType().equalsIgnoreCase(channelType) &&
                payload.getTokenSessionCurrent() != null &&
                payload.getTokenSessionCurrent().equals(tokenSessionId)
            ) {
                log.info(
                    "[WS] closeCurrentSessionsOfUser userId={} channelType={} sessionId={}",
                    userId,
                    channelType,
                    tokenSessionId
                );
                try {
                    s.sendMessage(new TextMessage(JsonF.toJson(msg)));
                    Thread.sleep(100);
                    s.close();
                } catch (Exception ignored) {
                    //
                }
            }
        }
    }

    public void closeAllSessionsOfUser(String userId) {
        log.info("[WS] closeAllSessionsOfUser userId={} ...", userId);
        Set<WebSocketSession> sessions = userSessions.remove(userId);
        if (ObjectUtils.isEmpty(sessions)) {
            return;
        }
        for (WebSocketSession s : sessions) {
            try {
                s.close();
            } catch (IOException ignored) {
                //
            }
        }
    }

    public void send(WsMessage msg) {
        if (userSessions.isEmpty()) {
            log.debug("[WS] send to all: no sessions");
            return;
        }
        try {
            String payload = JsonF.toJson(msg);
            for (Set<WebSocketSession> sessions : userSessions.values()) {
                for (WebSocketSession s : sessions) {
                    if (s.isOpen()) {
                        s.sendMessage(new TextMessage(payload));
                    }
                }
            }
            log.debug("[WS] send to all: broadcast done");
        } catch (Exception e) {
            log.error("[WS] send to all error", e);
        }
    }

    public void sendToUser(String userId, WsMessage msg) {
        Set<WebSocketSession> sessions = userSessions.get(userId);
        if (ObjectUtils.isEmpty(sessions)) {
            log.info("[WS] sendToUser userId={} not found session!", userId);
            return;
        }
        try {
            String payload = JsonF.toJson(msg);
            for (WebSocketSession s : sessions) {
                if (s.isOpen()) {
                    s.sendMessage(new TextMessage(payload));
                }
            }
        } catch (Exception e) {
            log.error("[WS] sendToUser {} error", userId, e);
        }
    }

    public void sendToUserByChannel(String userId, String channelType, WsMessage msg) {
        Set<WebSocketSession> sessions = userSessions.get(userId);
        if (ObjectUtils.isEmpty(sessions)) {
            log.info("[WS] sendToUserByChannel userId={} not found session!", userId);
            return;
        }
        try {
            String payload = JsonF.toJson(msg);
            for (WebSocketSession s : sessions) {
                String sChannel = (String) s.getAttributes().get(WS_ATTRIBUTE_CHANNEL_TYPE);
                if (s.isOpen() && channelType.equalsIgnoreCase(sChannel)) {
                    s.sendMessage(new TextMessage(payload));
                }
            }
        } catch (Exception e) {
            log.error("[WS] sendToUser {} error", userId, e);
        }
    }
}
