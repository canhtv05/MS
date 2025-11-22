package com.leaf.noti.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.leaf.common.constant.EventConstants;
import com.leaf.common.dto.event.VerificationEmailEvent;

@Service
public class VerifyEmailService {

  @KafkaListener(topics = EventConstants.verificationEmailTopic, groupId = "notification-group", containerFactory = "verificationEmailEventListenerFactory")
  public void listen(VerificationEmailEvent event) {

  }
}
