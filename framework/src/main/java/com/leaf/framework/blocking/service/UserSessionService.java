package com.leaf.framework.blocking.service;

import com.leaf.common.dto.UserSessionDTO;
import com.leaf.common.utils.AESUtils;
import com.leaf.common.utils.JsonF;
import com.leaf.framework.blocking.config.cache.RedisCacheService;
import com.leaf.framework.blocking.exception.NoAuthenticationError;
import com.leaf.framework.config.ApplicationProperties;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserSessionService {

    private final ApplicationProperties applicationProperties;
    private final SessionStore sessionStore;
    private final RedisCacheService redisService;

    public <T extends UserSessionDTO> void cacheUserSession(T userSession) {
        try {
            String data = JsonF.toJson(userSession);
            long ttl = this.applicationProperties.getSecurity().getValidDurationInSeconds() + 300L;
            var keyUser = sessionStore.getKeyUser(userSession.getUsername(), userSession.getChannel());
            redisService.set(keyUser, data, ttl, TimeUnit.SECONDS);
        } catch (Exception e) {
            log.error("Cache user session error: {}", e.getMessage());
            throw e;
        }
    }

    public void cacheToken(String username, String channelType, String token) {
        try {
            redisService.set(
                sessionStore.getKeyToken(username, channelType),
                AESUtils.hexString(token),
                this.applicationProperties.getSecurity().getValidDurationInSeconds(),
                TimeUnit.SECONDS
            );
        } catch (Exception e) {
            log.error("Cache user token error: {}", e.getMessage());
            throw e;
        }
    }

    public String getOldToken(String username, String channelType) {
        String keyToken = sessionStore.getKeyToken(username, channelType);
        return redisService.get(keyToken, String.class);
    }

    public void removeOldSessionByChanelType(String username, String channelType) {
        try {
            String keyToken = redisService.get(sessionStore.getKeyToken(username, channelType), String.class);
            if (StringUtils.isNotBlank(keyToken)) {
                redisService.evict(sessionStore.getKeyToken(username, channelType));
            }
            var keyUser = sessionStore.getKeyUser(username, channelType);
            if (StringUtils.isNotBlank(keyUser)) {
                redisService.evict(sessionStore.getKeyUser(username, channelType));
            }
        } catch (Exception e) {
            log.error("Remove old session error: {}", e.getMessage());
        }
    }

    public String isUserOnline(String username, String channelType) {
        try {
            return redisService.get(sessionStore.getKeyToken(username, channelType), String.class);
        } catch (Exception var4) {
            return null;
        }
    }

    public UserSessionDTO getUserSessionInfo(String username, String channelType) {
        String data = redisService.get(sessionStore.getKeyUser(username, channelType), String.class);
        UserSessionDTO sessionInfo = JsonF.jsonToObject(data, UserSessionDTO.class);
        if (ObjectUtils.isEmpty(sessionInfo)) {
            throw new NoAuthenticationError(HttpStatus.UNAUTHORIZED, "Không tìm thấy phiên đăng nhập của user");
        } else {
            return sessionInfo;
        }
    }

    public UserSessionDTO getUserSessionInfo() {
        var currentUser = CommonService.getAuthInfo();
        if (ObjectUtils.isEmpty(currentUser)) {
            throw new NoAuthenticationError(HttpStatus.UNAUTHORIZED, "Không tìm thấy phiên đăng nhập của user");
        } else {
            return this.getUserSessionInfo(currentUser.getUsername(), currentUser.getChannel());
        }
    }
}
