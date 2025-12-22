package com.leaf.noti.service;

import com.leaf.common.dto.event.VerificationEmailEvent;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.grpc.VerifyEmailTokenDTO;
import com.leaf.framework.service.RedisService;
import com.leaf.noti.domain.EmailVerificationLogs;
import com.leaf.noti.dto.VerifyEmailTokenResponse;
import com.leaf.noti.enums.VerificationStatus;
import com.leaf.noti.grpc.GrpcAuthClient;
import com.leaf.noti.repository.EmailVerificationLogsRepository;
import com.leaf.noti.util.TokenUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import java.time.Instant;
import java.util.Objects;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationService {

    GrpcAuthClient grpcAuthClient;
    RedisService redisService;
    TokenUtil tokenUtil;
    EmailVerificationLogsRepository emailVerificationLogsRepository;
    EmailService emailService;

    public VerifyEmailTokenResponse verifyEmailToken(String token) {
        try {
            EmailVerificationLogs logs = emailVerificationLogsRepository
                .findByToken(token)
                .orElseThrow(() -> new ApiException(ErrorMessage.EMAIL_TOKEN_INVALID));
            if (logs.getVerificationStatus() == VerificationStatus.VERIFIED) {
                return VerifyEmailTokenResponse.builder()
                    .valid(true)
                    .verificationStatus(VerificationStatus.VERIFIED)
                    .build();
            }

            String username = redisService.getUsernameIfEmailTokenAlive(token);
            if (!StringUtils.hasText(username)) {
                if (logs.getExpiredAt().isBefore(Instant.now())) {
                    logs.setVerificationStatus(VerificationStatus.EXPIRED);
                    emailVerificationLogsRepository.save(logs);
                    return VerifyEmailTokenResponse.builder()
                        .valid(false)
                        .verificationStatus(VerificationStatus.EXPIRED)
                        .build();
                }
                logs.setVerificationStatus(VerificationStatus.INVALID);
                emailVerificationLogsRepository.save(logs);
                return VerifyEmailTokenResponse.builder()
                    .valid(false)
                    .verificationStatus(VerificationStatus.INVALID)
                    .build();
            }

            VerifyEmailTokenDTO tokenDTO;
            try {
                tokenDTO = tokenUtil.parseToken(token);
            } catch (ExpiredJwtException e) {
                logs.setVerificationStatus(VerificationStatus.EXPIRED);
                emailVerificationLogsRepository.save(logs);
                return VerifyEmailTokenResponse.builder()
                    .valid(false)
                    .verificationStatus(VerificationStatus.EXPIRED)
                    .build();
            } catch (
                MalformedJwtException
                | UnsupportedJwtException
                | SignatureException
                | IllegalArgumentException e
            ) {
                logs.setVerificationStatus(VerificationStatus.INVALID);
                emailVerificationLogsRepository.save(logs);
                return VerifyEmailTokenResponse.builder()
                    .valid(false)
                    .verificationStatus(VerificationStatus.INVALID)
                    .build();
            }

            if (
                !Objects.equals(username, tokenDTO.getUsername()) ||
                !Objects.equals(logs.getExpiredAt().getEpochSecond(), tokenDTO.getExpiredAt().getSeconds()) ||
                !Objects.equals(logs.getJti(), tokenDTO.getJti()) ||
                !Objects.equals(logs.getEmail(), tokenDTO.getEmail())
            ) {
                logs.setVerificationStatus(VerificationStatus.INVALID);
                emailVerificationLogsRepository.save(logs);
                return VerifyEmailTokenResponse.builder()
                    .valid(false)
                    .verificationStatus(VerificationStatus.INVALID)
                    .build();
            }
            VerifyEmailTokenDTO request = VerifyEmailTokenDTO.newBuilder()
                .setUsername(username)
                .setEmail(tokenDTO.getEmail())
                .build();

            var response = grpcAuthClient.verifyEmailToken(request);
            logs.setVerificationStatus(VerificationStatus.VERIFIED);
            logs.setVerifiedAt(Instant.now());
            emailVerificationLogsRepository.save(logs);
            redisService.deleteEmailToken(token);
            return VerifyEmailTokenResponse.builder()
                .valid(Objects.nonNull(response) && StringUtils.hasText(response.getUsername()))
                .verificationStatus(VerificationStatus.VERIFIED)
                .build();
        } catch (Exception e) {
            return VerifyEmailTokenResponse.builder()
                .valid(false)
                .verificationStatus(VerificationStatus.INVALID)
                .build();
        }
    }

    public void resendEmailToken(VerificationEmailEvent request) {
        EmailVerificationLogs logs = emailVerificationLogsRepository
            .findByUserId(request.getUsername())
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_NOT_FOUND));

        VerificationStatus verificationStatus = logs.getVerificationStatus();
        if (verificationStatus == VerificationStatus.PENDING) {
            throw new ApiException(ErrorMessage.EMAIL_TOKEN_ALREADY_SENT);
        }
        if (verificationStatus == VerificationStatus.VERIFIED) {
            throw new ApiException(ErrorMessage.EMAIL_VERIFIED);
        }
        if (verificationStatus == VerificationStatus.INVALID || verificationStatus == VerificationStatus.EXPIRED) {
            try {
                redisService.deleteEmailToken(logs.getToken());
                request.setTo(logs.getEmail());
                emailService.sendVerificationEmail(request);
                return;
            } catch (Exception e) {
                throw new ApiException(ErrorMessage.SEND_EMAIL_ERROR);
            }
        }

        throw new ApiException(ErrorMessage.EMAIL_TOKEN_INVALID);
    }
}
