package com.leaf.noti.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.leaf.common.constant.EventConstants;
import com.leaf.common.dto.event.ForgotPasswordEvent;
import com.leaf.common.dto.event.VerificationEmailEvent;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaListenerService {

    private final EmailService emailService;
    private static final String GROUP_ID = "notification-group";

    @KafkaListener(topics = EventConstants.VERIFICATION_EMAIL_TOPIC, groupId = GROUP_ID, containerFactory = "verificationEmailKafkaListenerContainerFactory")
    public void listenVerifyEmailToken(VerificationEmailEvent verificationEmailEvent) {
        try {
            emailService.sendVerificationEmail(verificationEmailEvent);
        } catch (Exception e) {
            throw new ApiException(ErrorMessage.SEND_EMAIL_ERROR);
        }
    }

    @KafkaListener(topics = EventConstants.FORGOT_PASSWORD_TOPIC, groupId = GROUP_ID, containerFactory = "forgotPasswordKafkaListenerContainerFactory")
    public void listenForgotPassword(ForgotPasswordEvent forgotPasswordEvent) {
        try {
            emailService.sendForgotPasswordEmail(forgotPasswordEvent);
        } catch (Exception e) {
            throw new ApiException(ErrorMessage.SEND_EMAIL_ERROR);
        }
    }
}