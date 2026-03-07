package com.leaf.socket.config;

import static com.leaf.socket.service.WebsocketSessionManager.getIdleTimeoutMs;

import com.leaf.socket.service.WebsocketSessionManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketIdleTask {

    private final WebsocketSessionManager sessionManager;

    @Scheduled(fixedRate = 60_000) // mỗi 1 phút
    public void closeIdleSessions() {
        sessionManager.closeIdleSessions(getIdleTimeoutMs());
    }
}
