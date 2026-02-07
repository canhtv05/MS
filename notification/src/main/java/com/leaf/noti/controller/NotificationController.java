package com.leaf.noti.controller;

import com.leaf.common.dto.ResponseObject;
import com.leaf.common.dto.event.VerificationEmailEvent;
import com.leaf.noti.dto.VerifyEmailTokenRes;
import com.leaf.noti.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/verify-email")
    public ResponseEntity<ResponseObject<VerifyEmailTokenRes>> verifyEmail(@RequestParam String token) {
        return ResponseEntity.ok(ResponseObject.success(notificationService.verifyEmailToken(token)));
    }

    @PostMapping("/resend-verify-email")
    public ResponseEntity<ResponseObject<Void>> resendEmailToken(@RequestBody VerificationEmailEvent event) {
        notificationService.resendEmailToken(event);
        return ResponseEntity.ok(ResponseObject.success());
    }
}
