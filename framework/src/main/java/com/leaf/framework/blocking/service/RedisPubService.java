package com.leaf.framework.blocking.service;

import com.leaf.common.socket.WsMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RTopic;
import org.redisson.api.RedissonClient;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisPubService {

    private final Environment environment;
    private final RedissonClient redisson;

    public void pubWebsocketTopic(WsMessage wsMessage) {
        try {
            // Gửi pub/sub
            String envRunning = environment.getActiveProfiles()[0];
            RTopic topic = redisson.getTopic(envRunning + ":ws:framework:event");
            topic.publish(wsMessage);
        } catch (IllegalArgumentException e) {
            log.error("pubWebsocketTopic error {}", e.getMessage(), e);
        }
    }
}
