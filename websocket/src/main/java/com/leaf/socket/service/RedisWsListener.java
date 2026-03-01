package com.leaf.socket.service;

import com.leaf.common.socket.WsMessage;
import com.leaf.common.socket.WsSessionRevokedMessage;
import com.leaf.common.utils.JsonF;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RTopic;
import org.redisson.api.RedissonClient;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisWsListener {

    private final Environment environment;
    private final RedissonClient redisson;
    private final WebsocketSessionManager wsSessionManager;

    @PostConstruct
    public void init() {
        String envRunning = environment.getActiveProfiles()[0];
        RTopic topic = redisson.getTopic(envRunning + ":ws:framework:event");
        topic.addListener(WsMessage.class, (channel, msg) -> {
            log.info("Received message for channel: {}, message: {}", channel, JsonF.toJson(msg));
            if (WsMessage.WsType.KICK.equals(msg.getType())) {
                this.processForceLogout(msg);
            } else {
                wsSessionManager.sendToUser(msg.getUserId(), msg);
            }
        });
    }

    private void processForceLogout(WsMessage msg) {
        try {
            WsSessionRevokedMessage result = JsonF.jsonToObject(msg.getData(), WsSessionRevokedMessage.class);
            log.info("[WS] processForceLogout with data: {}", JsonF.toJson(result));
            if (ObjectUtils.isEmpty(result)) {
                wsSessionManager.sendToUser(msg.getUserId(), msg);
                Thread.sleep(100);
                wsSessionManager.closeAllSessionsOfUser(msg.getUserId());
            } else {
                wsSessionManager.closeCurrentSessionsOfUser(msg.getUserId(), result, msg);
            }
        } catch (InterruptedException e) {
            //
        }
    }
}
