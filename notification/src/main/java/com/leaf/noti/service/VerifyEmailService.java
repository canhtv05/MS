package com.leaf.noti.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.leaf.common.constant.EventConstants;
import com.leaf.common.dto.event.VerificationEmailEvent;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class VerifyEmailService {

  private final EmailService emailService;

  @KafkaListener(topics = EventConstants.verificationEmailTopic, groupId = "notification-group", containerFactory = "verificationEmailEventListenerFactory")
  public void listen(VerificationEmailEvent event) {
    try {
      emailService.sendVerificationEmail(event);
    } catch (Exception e) {
      throw new ApiException(ErrorMessage.SEND_EMAIL_ERROR, e.getMessage());
    }
  }
}