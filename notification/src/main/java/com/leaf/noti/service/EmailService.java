package com.leaf.noti.service;

import java.util.Objects;

import org.springframework.lang.NonNull;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.leaf.common.dto.event.VerificationEmailEvent;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.service.RedisService;
import com.leaf.noti.config.EmailProperties;
import com.leaf.noti.util.TokenUtil;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {

    JavaMailSender javaMailSender;
    SpringTemplateEngine templateEngine;
    RedisService redisService;
    EmailProperties emailProperties;
    TokenUtil tokenUtil;

    public void sendVerificationEmail(@NonNull VerificationEmailEvent event) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailProperties.getUsername());
            helper.setTo(Objects.requireNonNull(event.getTo()));
            helper.setSubject("🔐 Xác thực tài khoản của bạn");

            String token = tokenUtil.generateToken(event);
            redisService.saveVerificationToken(token, event.getUsername());
            Context context = new Context();
            context.setVariable("username", event.getUsername());
            context.setVariable("token", token);
            context.setVariable("verificationUrl",
                    new StringBuilder(emailProperties.getVerifyUrl()).append("?token=").append(token).toString());

            String body = templateEngine.process("email-verification", context);

            helper.setText(body, true);
            javaMailSender.send(message);

        } catch (MessagingException e) {
            throw new ApiException(ErrorMessage.SEND_EMAIL_ERROR, e.getMessage());
        }
    }
}