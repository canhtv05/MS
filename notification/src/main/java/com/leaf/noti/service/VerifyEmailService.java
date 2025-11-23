package com.leaf.noti.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.leaf.common.constant.EventConstants;
import com.leaf.common.dto.event.VerificationEmailEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class VerifyEmailService {

  private final EmailService emailService;

  @KafkaListener(topics = EventConstants.verificationEmailTopic, groupId = "notification-group", containerFactory = "verificationEmailEventListenerFactory")
  public void listen(VerificationEmailEvent event) {
    log.info("📨 Nhận được yêu cầu gửi email xác thực cho: {}", event.getUsername());

    try {
      emailService.sendVerificationEmail(event);
      log.info("✅ Xử lý email xác thực thành công cho: {}", event.getUsername());
    } catch (Exception e) {
      log.error("❌ Lỗi khi xử lý email xác thực cho {}: {}", event.getUsername(), e.getMessage(), e);
    }
  }
}