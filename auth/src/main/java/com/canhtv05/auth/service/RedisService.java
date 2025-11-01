package com.canhtv05.auth.service;

import lombok.RequiredArgsConstructor;

import org.springframework.core.env.Environment;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final Environment environment;

    private String getKeyToken(String username) {
        String envRunning = environment.getActiveProfiles()[0];
        return String.format("%s:token:%s", envRunning, username);
    }

    public void saveToken(String username, String token, long durationSeconds) {
        String key = this.getKeyToken(username);
        redisTemplate.execute(new SessionCallback<Object>() {
            @SuppressWarnings({ "rawtypes" })
            @Override
            public Object execute(@org.springframework.lang.NonNull RedisOperations operations)
                    throws DataAccessException {
                operations.multi();
                operations.delete(key);
                operations.opsForValue().set(key, token, durationSeconds, TimeUnit.SECONDS);
                return operations.exec();
            }
        });
    }

    public String getToken(String username) {
        return (String) redisTemplate.opsForValue().get(this.getKeyToken(username));
    }

    public boolean isTokenValid(String username, String token) {
        String key = this.getKeyToken(username);
        Object storedToken = redisTemplate.opsForValue().get(key);

        if (storedToken == null) {
            return false;
        }

        return Objects.equals(storedToken, token);
    }

    public void deleteToken(String jwtName) {
        redisTemplate.delete(this.getKeyToken(jwtName));
    }
}