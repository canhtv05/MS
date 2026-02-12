package com.leaf.noti.service;

import com.leaf.common.dto.event.VerificationEmailEvent;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.grpc.VerifyEmailTokenDTO;
import com.leaf.framework.blocking.config.cache.RedisCacheService;
import com.leaf.framework.blocking.service.KeyCacheService;
import com.leaf.noti.domain.EmailVerificationLogs;
import com.leaf.noti.dto.VerifyEmailTokenRes;
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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
public class NotificationService {

    private final GrpcAuthClient grpcAuthClient;
    private final RedisCacheService redisService;
    private final KeyCacheService keyCacheService;
    private final TokenUtil tokenUtil;
    private final EmailVerificationLogsRepository emailVerificationLogsRepository;
    private final EmailService emailService;

    public VerifyEmailTokenRes verifyEmailToken(String token) {
        try {
            EmailVerificationLogs logs = emailVerificationLogsRepository
                .findByToken(token)
                .orElseThrow(() -> {
                    return new ApiException(ErrorMessage.EMAIL_TOKEN_INVALID);
                });
            if (logs.getVerificationStatus() == VerificationStatus.VERIFIED) {
                return VerifyEmailTokenRes.builder()
                    .valid(true)
                    .verificationStatus(VerificationStatus.VERIFIED)
                    .build();
            }

            VerifyEmailTokenDTO tokenDTO;
            try {
                String rawToken = tokenUtil.decryptToken(token);
                tokenDTO = tokenUtil.parseToken(rawToken);
            } catch (ExpiredJwtException e) {
                logs.setVerificationStatus(VerificationStatus.EXPIRED);
                emailVerificationLogsRepository.save(logs);
                return VerifyEmailTokenRes.builder()
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
                return VerifyEmailTokenRes.builder()
                    .valid(false)
                    .verificationStatus(VerificationStatus.INVALID)
                    .build();
            }

            long logsExpiredAt = logs.getExpiredAt() != null ? logs.getExpiredAt().getEpochSecond() : 0;
            long tokenExpiredAt = tokenDTO.getExpiredAt() != null ? tokenDTO.getExpiredAt().getSeconds() : 0;
            long expiredAtDiff = Math.abs(logsExpiredAt - tokenExpiredAt);
            boolean jtiMatch = Objects.equals(logs.getJti(), tokenDTO.getJti());
            boolean emailMatch = Objects.equals(logs.getEmail(), tokenDTO.getEmail());

            if (expiredAtDiff > 1 || !jtiMatch || !emailMatch) {
                logs.setVerificationStatus(VerificationStatus.INVALID);
                emailVerificationLogsRepository.save(logs);
                return VerifyEmailTokenRes.builder()
                    .valid(false)
                    .verificationStatus(VerificationStatus.INVALID)
                    .build();
            }

            String keyVerification = keyCacheService.getKeyVerification(tokenDTO.getUsername());
            String tokenFromRedis = redisService.get(keyVerification, String.class);

            if (!StringUtils.hasText(tokenFromRedis) || !Objects.equals(tokenFromRedis, token)) {
                logs.setVerificationStatus(VerificationStatus.INVALID);
                emailVerificationLogsRepository.save(logs);
                return VerifyEmailTokenRes.builder()
                    .valid(false)
                    .verificationStatus(VerificationStatus.INVALID)
                    .build();
            }

            String username = tokenDTO.getUsername();

            String fullname = StringUtils.hasText(tokenDTO.getFullname()) ? tokenDTO.getFullname() : logs.getFullname();

            VerifyEmailTokenDTO request = VerifyEmailTokenDTO.newBuilder()
                .setUsername(username)
                .setEmail(tokenDTO.getEmail())
                .setFullname(fullname)
                .build();

            var response = grpcAuthClient.verifyEmailToken(request);
            logs.setVerificationStatus(VerificationStatus.VERIFIED);
            logs.setVerifiedAt(Instant.now());
            emailVerificationLogsRepository.save(logs);
            redisService.evict(keyVerification);
            boolean isValid = Objects.nonNull(response) && StringUtils.hasText(response.getUsername());
            return VerifyEmailTokenRes.builder().valid(isValid).verificationStatus(VerificationStatus.VERIFIED).build();
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            return VerifyEmailTokenRes.builder().valid(false).verificationStatus(VerificationStatus.INVALID).build();
        }
    }

    public void resendEmailToken(VerificationEmailEvent request) {
        EmailVerificationLogs logs = emailVerificationLogsRepository
            .findByUserId(request.getUsername())
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_NOT_FOUND));

        VerificationStatus verificationStatus = logs.getVerificationStatus();

        if (verificationStatus == VerificationStatus.VERIFIED) {
            throw new ApiException(ErrorMessage.EMAIL_VERIFIED);
        }

        if (verificationStatus == VerificationStatus.PENDING) {
            boolean tokenExpired = logs.getExpiredAt() != null && logs.getExpiredAt().isBefore(Instant.now());
            if (!tokenExpired) {
                throw new ApiException(ErrorMessage.EMAIL_TOKEN_ALREADY_SENT);
            }
        }

        try {
            String keyVerification = keyCacheService.getKeyVerification(request.getUsername());
            redisService.evict(keyVerification);
            request.setTo(logs.getEmail());
            request.setFullName(logs.getFullname());
            request.setUsername(logs.getUserId());
            emailService.sendVerificationEmail(request);
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            throw new ApiException(ErrorMessage.SEND_EMAIL_ERROR);
        }
    }
}
