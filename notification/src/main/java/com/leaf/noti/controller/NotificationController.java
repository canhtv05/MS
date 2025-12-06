package com.leaf.noti.controller;

import com.leaf.common.dto.ResponseObject;
import com.leaf.common.dto.event.VerificationEmailEvent;
import com.leaf.noti.dto.VerifyEmailTokenResponse;
import com.leaf.noti.service.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {

    NotificationService notificationService;

    @GetMapping("/verify-email")
    public ResponseEntity<ResponseObject<VerifyEmailTokenResponse>> verifyEmail(
        @RequestParam String token
    ) {
        return ResponseEntity.ok(
            ResponseObject.success(notificationService.verifyEmailToken(token))
        );
    }

    @PostMapping("/resend-verify-email")
    public ResponseEntity<ResponseObject<Void>> resendEmailToken(
        @RequestBody VerificationEmailEvent event
    ) {
        notificationService.resendEmailToken(event);
        return ResponseEntity.ok(ResponseObject.success());
    }
}
