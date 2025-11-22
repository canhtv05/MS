package com.leaf.noti.service;

import java.time.Duration;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RedisService {

  StringRedisTemplate redisTemplate;

  @SuppressWarnings("null")
  public void saveVerificationToken(String token, String userId) {
    redisTemplate.opsForValue().set(token, userId, Duration.ofMinutes(5));
  }

  @SuppressWarnings("null")
  public String validateToken(String token) {
    String userId = redisTemplate.opsForValue().get(token);
    if (userId != null) {
      redisTemplate.delete(token);
      return userId;
    }
    return null;
  }
}
