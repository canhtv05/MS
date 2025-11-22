package com.leaf.noti.service;

import java.util.Objects;
import java.util.UUID;

import org.springframework.lang.NonNull;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.leaf.common.dto.event.VerificationEmailEvent;

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

    @SuppressWarnings("null")
    public void sendOrderEmail(@NonNull VerificationEmailEvent event) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("sender@example.com");
            helper.setTo(Objects.requireNonNull(event.getTo()));
            helper.setSubject("🛒 Đơn hàng mới #");

            String token = UUID.randomUUID().toString();
            redisService.saveVerificationToken(token, event.getUsername());

            Context context = new Context();
            context.setVariable("username", event.getUsername());
            context.setVariable("token", token);
            String body = templateEngine.process("email-verification", context);

            helper.setText(body, true);

            javaMailSender.send(message);
            System.out.println("📧 Gửi email thành công!");

        } catch (MessagingException e) {
            System.err.println("❌ Gửi email thất bại: " + e.getMessage());
        }
    }
}
