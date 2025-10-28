package com.canhtv05.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisTokenService {

    private final RedisTemplate<String, Object> redisTemplate;

    public void saveToken(String username, String token, long durationMinutes) {
        String key = "TOKEN:" + username;
        redisTemplate.execute(new SessionCallback<Object>() {
            @SuppressWarnings({ "rawtypes" })
            @Override
            public Object execute(@org.springframework.lang.NonNull RedisOperations operations)
                    throws DataAccessException {
                operations.multi();
                redisTemplate.delete(key);
                redisTemplate.opsForValue().set(key, token, durationMinutes, TimeUnit.MINUTES);
                return operations.exec();
            }
        });
    }

    public String getToken(String username) {
        return (String) redisTemplate.opsForValue().get("TOKEN:" + username);
    }

    public boolean isTokenValid(String username, String token) {
        return Boolean.TRUE.equals(redisTemplate.hasKey("TOKEN:" + username)
                && Objects.equals(redisTemplate.opsForValue().get("TOKEN:" + username), token));
    }

    public void deleteToken(String jwtId) {
        redisTemplate.delete("TOKEN:" + jwtId);
    }
}