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
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;
    private final RedisService redisService;
    private final EmailProperties emailProperties;
    private final TokenUtil tokenUtil;
    private final EmailVerificationLogsRepository emailVerificationLogsRepository;

    public void sendVerificationEmail(@NonNull VerificationEmailEvent event) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailProperties.getUsername());
            helper.setTo(Objects.requireNonNull(event.getTo()));
            helper.setSubject("🔐 Xác thực tài khoản của bạn");

            Date expiredAt = new Date(System.currentTimeMillis() + 10 * 60 * 1000); // 10min

            String token = tokenUtil.generateToken(event, expiredAt);
            String encryptedToken = tokenUtil.encryptToken(token);
            String urlEncodedToken = URLEncoder.encode(encryptedToken, StandardCharsets.UTF_8);
            redisService.set(
                redisService.getKeyVerification(event.getUsername()),
                encryptedToken,
                10,
                TimeUnit.MINUTES
            );

            var claims = Jwts.parserBuilder()
                .setSigningKey(tokenUtil.getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
            String jti = claims.getId();
            EmailVerificationLogs logs = emailVerificationLogsRepository.findByUserId(event.getUsername()).orElse(null);

            if (logs == null) {
                logs = EmailVerificationLogs.builder()
                    .userId(event.getUsername())
                    .fullname(event.getFullName())
                    .email(event.getTo())
                    .token(encryptedToken)
                    .jti(jti)
                    .expiredAt(expiredAt.toInstant())
                    .verificationStatus(VerificationStatus.PENDING)
                    .build();
                emailVerificationLogsRepository.save(logs);
            } else {
                logs.setToken(encryptedToken);
                logs.setJti(jti);
                logs.setExpiredAt(expiredAt.toInstant());
                logs.setVerificationStatus(VerificationStatus.PENDING);
                logs.setVerifiedAt(null);
                emailVerificationLogsRepository.save(logs);
            }

            Context context = new Context();
            context.setVariable("username", event.getUsername());
            context.setVariable("token", encryptedToken);
            context.setVariable("verificationUrl", emailProperties.getVerifyUrl() + "?token=" + urlEncodedToken);

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
            String key = redisService.getKeyForgotPassword(event.getUsername());
            redisService.set(key, otp, 10, TimeUnit.MINUTES);

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
