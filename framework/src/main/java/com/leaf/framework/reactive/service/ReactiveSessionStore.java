package com.leaf.framework.reactive.service;

import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

/**
 * Reactive version of KeyCacheService for use in reactive contexts (e.g.,
 * Spring Cloud Gateway).
 * This service is stateless and can be used directly in reactive context.
 */
@Service
@RequiredArgsConstructor
public class ReactiveSessionStore {

    private final Environment environment;

    public Mono<String> getKeyToken(String username, String channel) {
        return Mono.fromCallable(() -> {
            String envRunning = environment.getActiveProfiles()[0];
            return String.format("%s:token:%s:%s", envRunning, username, channel);
        });
    }

    public Mono<String> getKeyUser(String username, String channel) {
        return Mono.fromCallable(() -> {
            String envRunning = environment.getActiveProfiles()[0];
            return String.format("%s:user:%s:%s", envRunning, username, channel);
        });
    }

    public Mono<String> getKeyVerification(String userId) {
        return Mono.fromCallable(() -> {
            String envRunning = environment.getActiveProfiles()[0];
            return String.format("%s:verify:email:%s", envRunning, userId);
        });
    }

    public Mono<String> getKeyForgotPassword(String token) {
        return Mono.fromCallable(() -> {
            String envRunning = environment.getActiveProfiles()[0];
            return String.format("%s:forgot:password:%s", envRunning, token);
        });
    }
}
