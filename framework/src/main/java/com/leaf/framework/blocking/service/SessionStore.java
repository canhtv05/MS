package com.leaf.framework.blocking.service;

import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

/**
 * Blocking version of KeyCacheService for use in blocking contexts (e.g.,
 * Spring MVC).
 * For reactive contexts (e.g., Spring Cloud Gateway), use
 * ReactiveKeyCacheService instead.
 */
@Service
@RequiredArgsConstructor
public class SessionStore {

    private final Environment environment;

    public String getKeyToken(String username, String channel) {
        String envRunning = environment.getActiveProfiles()[0];
        return String.format("%s:token:%s:%s", envRunning, username, channel);
    }

    public String getKeyUser(String username, String channel) {
        String envRunning = environment.getActiveProfiles()[0];
        return String.format("%s:user:%s:%s", envRunning, username, channel);
    }

    public String getKeyVerification(String userId) {
        String envRunning = environment.getActiveProfiles()[0];
        return String.format("%s:verify:email:%s", envRunning, userId);
    }

    public String getKeyForgotPassword(String token) {
        String envRunning = environment.getActiveProfiles()[0];
        return String.format("%s:forgot:password:%s", envRunning, token);
    }
}
