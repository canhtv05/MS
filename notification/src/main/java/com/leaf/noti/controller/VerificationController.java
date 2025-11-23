package com.leaf.noti.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.leaf.common.dto.ResponseObject;
import com.leaf.common.service.RedisService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VerificationController {

    RedisService redisService;

    @GetMapping("/verify-email")
    public ResponseEntity<ResponseObject<Boolean>> verifyEmail(@RequestParam String token) {
        String userId = redisService.validateToken(token);
        return ResponseEntity.ok(ResponseObject.success(userId != null));
    }
}
