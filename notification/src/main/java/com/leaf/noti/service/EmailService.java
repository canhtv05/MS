package com.leaf.noti.service;

import com.leaf.common.dto.event.ForgotPasswordEvent;
import com.leaf.common.dto.event.VerificationEmailEvent;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.framework.service.RedisService;
import com.leaf.noti.config.EmailProperties;
import com.leaf.noti.domain.EmailVerificationLogs;
import com.leaf.noti.enums.VerificationStatus;
import com.leaf.noti.repository.EmailVerificationLogsRepository;
import com.leaf.noti.util.TokenUtil;
import io.jsonwebtoken.Jwts;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Date;
import java.util.Objects;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.lang.NonNull;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

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
            EmailVerificationLogs logs = emailVerificationLogsRepository.findByUserId(event.getUsername()).orElse(null);

            String jti = Jwts.parserBuilder()
                .setSigningKey(tokenUtil.getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getId();

            if (Objects.isNull(logs)) {
                emailVerificationLogsRepository.save(
                    EmailVerificationLogs.builder()
                        .userId(event.getUsername())
                        .token(token)
                        .verifiedAt(null)
                        .jti(jti)
                        .expiredAt(expiredAt.toInstant())
                        .email(event.getTo())
                        .verificationStatus(VerificationStatus.PENDING)
                        .build()
                );
            } else {
                logs.setToken(token);
                logs.setExpiredAt(expiredAt.toInstant());
                logs.setVerificationStatus(VerificationStatus.PENDING);
                logs.setVerifiedAt(null);
                logs.setJti(jti);
                emailVerificationLogsRepository.save(logs);
            }

            Context context = new Context();
            context.setVariable("username", event.getUsername());
            context.setVariable("token", token);
            context.setVariable("verificationUrl", emailProperties.getVerifyUrl() + "?token=" + token);

            String body = templateEngine.process("email-verification", context);

            helper.setText(body, true);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new ApiException(ErrorMessage.SEND_EMAIL_ERROR);
        }
    }

    public void sendForgotPasswordEmail(@NonNull ForgotPasswordEvent event) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailProperties.getUsername());
            helper.setTo(Objects.requireNonNull(event.getTo()));
            helper.setSubject("🔐 Quên mật khẩu");

            String otp = String.valueOf((int) ((Math.random() * (999999 - 100000)) + 100000));
            redisService.saveForgotPasswordOTP(event.getUsername(), otp);

            Context context = new Context();
            context.setVariable("username", event.getUsername());
            context.setVariable("otp", otp);

            String body = templateEngine.process("forgot-password", context);

            helper.setText(body, true);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new ApiException(ErrorMessage.SEND_EMAIL_ERROR);
        }
    }
}
