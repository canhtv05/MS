package com.leaf.noti.service;

import java.time.Instant;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.grpc.VerifyEmailTokenDTO;
import com.leaf.common.service.RedisService;
import com.leaf.noti.domain.EmailVerificationLogs;
import com.leaf.noti.dto.VerifyEmailTokenResponse;
import com.leaf.noti.enums.VerificationStatus;
import com.leaf.noti.grpc.GrpcAuthClient;
import com.leaf.noti.repository.EmailVerificationLogsRepository;
import com.leaf.noti.util.TokenUtil;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationService {

    GrpcAuthClient grpcAuthClient;
    RedisService redisService;
    TokenUtil tokenUtil;
    EmailVerificationLogsRepository emailVerificationLogsRepository;

    public VerifyEmailTokenResponse verifyEmailToken(String token) {
        try {
            EmailVerificationLogs logs = emailVerificationLogsRepository.findByToken(token)
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
                return VerifyEmailTokenResponse.builder().valid(false).verificationStatus(VerificationStatus.INVALID)
                        .build();
            }

            VerifyEmailTokenDTO tokenDTO = tokenUtil.parseToken(token);
            if (!Objects.equals(username, tokenDTO.getUsername())
                    || !Objects.equals(logs.getExpiredAt().getEpochSecond(), tokenDTO.getExpiredAt().getSeconds())
                    || !Objects.equals(logs.getJti(), tokenDTO.getJti())) {
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
}
