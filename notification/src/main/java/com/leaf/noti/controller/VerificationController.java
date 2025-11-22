package com.leaf.noti.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.leaf.noti.service.RedisService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VerificationController {

  RedisService redisService;

  @GetMapping("/verify-email")
  public String verifyEmail(@RequestParam("token") String token) {
    String userId = redisService.validateToken(token);
    if (userId != null) {
      return "<h1>Verification successful!</h1><p>Your email has been verified.</p>";
    } else {
      return "<h1>Verification failed</h1><p>Invalid or expired token.</p>";
    }
  }
}
