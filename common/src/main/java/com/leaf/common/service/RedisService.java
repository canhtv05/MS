package com.leaf.common.service;

import lombok.RequiredArgsConstructor;

import org.springframework.core.env.Environment;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.leaf.common.dto.UserSessionDTO;
import com.leaf.common.utils.AESUtils;
import com.leaf.common.utils.JsonF;

import java.time.Duration;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final Environment environment;

    private String getKeyToken(String username, String channel) {
        String envRunning = environment.getActiveProfiles()[0];
        return String.format("%s:token:%s:%s", envRunning, username, channel);
    }

    private String getKeyUser(String username, String channel) {
        String envRunning = environment.getActiveProfiles()[0];
        return String.format("%s:user:%s:%s", envRunning, username, channel);
    }

    private String getKeyVerification(String token) {
        String envRunning = environment.getActiveProfiles()[0];
        return String.format("%s:verify:email:%s", envRunning, token);
    }

    public String getToken(String username, String channel) {
        return (String) redisTemplate.opsForValue().get(this.getKeyToken(username, channel));
    }

    public boolean isTokenValid(String username, String channel, String token) {
        String key = this.getKeyToken(username, channel);
        String stored = (String) redisTemplate.opsForValue().get(key);

        String hashed = AESUtils.hexString(token);

        return Objects.equals(stored, hashed);
    }

    public void deleteToken(String username, String channel) {
        redisTemplate.delete(this.getKeyToken(username, channel));
    }

    public void cacheToken(String username, String channel, String token) {
        String tokenKey = this.getKeyToken(username, channel);
        redisTemplate.opsForValue().set(tokenKey, AESUtils.hexString(token));
    }

    public void cacheUser(String username, String channel, String sessionId, String secretKey) {
        String userKey = this.getKeyUser(username, channel);
        UserSessionDTO user = UserSessionDTO.builder()
                .sessionId(sessionId)
                .channel(channel)
                .username(username)
                .secretKey(secretKey)
                .build();
        redisTemplate.opsForValue().set(userKey, user);
    }

    public void deleteUser(String username, String channel) {
        redisTemplate.delete(this.getKeyUser(username, channel));
    }

    public UserSessionDTO getUser(String username, String channel) {
        String userKey = this.getKeyUser(username, channel);
        return JsonF.jsonToObject((String) redisTemplate.opsForValue().get(userKey),
                UserSessionDTO.class);
    }

    public void saveEmailToken(String token, String username) {
        redisTemplate.opsForValue().set(getKeyVerification(token), username, Duration.ofMinutes(10));
    }

    public String getUsernameIfEmailTokenAlive(String token) {
        return (String) redisTemplate.opsForValue().get(getKeyVerification(token));
    }

    public void deleteEmailToken(String token) {
        redisTemplate.delete(getKeyVerification(token));
    }
}
