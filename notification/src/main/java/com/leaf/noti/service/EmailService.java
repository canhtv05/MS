package com.leaf.noti.service;

import java.util.Date;
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
import com.leaf.noti.domain.EmailVerificationLogs;
import com.leaf.noti.enums.VerificationStatus;
import com.leaf.noti.repository.EmailVerificationLogsRepository;
import com.leaf.noti.util.TokenUtil;

import io.jsonwebtoken.Jwts;
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
    EmailVerificationLogsRepository emailVerificationLogsRepository;

    public void sendVerificationEmail(@NonNull VerificationEmailEvent event) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailProperties.getUsername());
            helper.setTo(Objects.requireNonNull(event.getTo()));
            helper.setSubject("🔐 Xác thực tài khoản của bạn");

            Date expiredAt = new Date(System.currentTimeMillis() + 10 * 60 * 1000); // 10min

            String token = tokenUtil.generateToken(event, expiredAt);
            redisService.saveEmailToken(token, event.getUsername());
            emailVerificationLogsRepository.save(EmailVerificationLogs.builder()
                    .userId(event.getUsername())
                    .token(token)
                    .verifiedAt(null)
                    .jti(Jwts.parserBuilder()
                            .setSigningKey(tokenUtil.getSigningKey())
                            .build()
                            .parseClaimsJws(token)
                            .getBody()
                            .getId())
                    .expiredAt(expiredAt.toInstant())
                    .verificationStatus(VerificationStatus.PENDING)
                    .build());
            Context context = new Context();
            context.setVariable("username", event.getUsername());
            context.setVariable("token", token);
            context.setVariable("verificationUrl",
                    new StringBuilder(emailProperties.getVerifyUrl()).append("?token=").append(token).toString());

            String body = templateEngine.process("email-verification", context);

            helper.setText(body, true);
            javaMailSender.send(message);

        } catch (MessagingException e) {
            throw new ApiException(ErrorMessage.SEND_EMAIL_ERROR);
        }
    }
}