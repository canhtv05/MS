package com.leaf.noti.service;

import java.util.Objects;

import org.springframework.stereotype.Service;

import com.leaf.common.grpc.VerifyEmailTokenDTO;
import com.leaf.common.service.RedisService;
import com.leaf.noti.dto.VerifyEmailTokenResponse;
import com.leaf.noti.grpc.GrpcAuthClient;
import com.leaf.noti.util.TokenUtil;

import io.micrometer.common.util.StringUtils;
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

    public VerifyEmailTokenResponse verifyEmailToken(String token) {
        try {
            String username = redisService.validateToken(token);
            if (StringUtils.isEmpty(username)) {
                return VerifyEmailTokenResponse.builder().valid(false).build();
            }
            VerifyEmailTokenDTO tokenDTO = tokenUtil.parseToken(token);
            if (!Objects.equals(username, tokenDTO.getUsername())) {
                return VerifyEmailTokenResponse.builder().valid(false).build();
            }
            VerifyEmailTokenDTO request = VerifyEmailTokenDTO.newBuilder()
                    .setUsername(username)
                    .setEmail(tokenDTO.getEmail())
                    .build();

            var response = grpcAuthClient.verifyEmailToken(request);
            return VerifyEmailTokenResponse.builder()
                    .valid(Objects.nonNull(response) && Objects.nonNull(response.getUsername())).build();
        } catch (Exception e) {
            return VerifyEmailTokenResponse.builder().valid(false).build();
        }
    }
}
