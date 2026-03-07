package com.leaf.graphql_bff.auth.resolver;

import com.leaf.common.grpc.AuthMeResponse;
import com.leaf.common.grpc.UserProfileIdRequest;
import com.leaf.common.grpc.UserProfileResponse;
import com.leaf.framework.blocking.config.cache.RedisCacheService;
import com.leaf.graphql_bff.auth.client.AuthGrpcAuthClient;
import com.leaf.graphql_bff.auth.client.AuthGrpcProfileClient;
import com.leaf.graphql_bff.auth.dto.UserProfileDTO;
import com.leaf.graphql_bff.auth.mapper.UserProfileMapper;
import com.leaf.graphql_bff.util.SecurityUtils;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@DgsComponent
@RequiredArgsConstructor
public class AuthQueryResolver {

    private final AuthGrpcAuthClient grpcAuthClient;
    private final AuthGrpcProfileClient grpcProfileClient;
    private final RedisCacheService redisService;

    @DgsQuery(field = "me")
    @PreAuthorize("isAuthenticated()")
    public Mono<UserProfileDTO> me() {
        return SecurityUtils.getCurrentUserLogin().flatMap(username ->
            Mono.fromCallable(() -> resolveMe(username)).subscribeOn(Schedulers.boundedElastic())
        );
    }

    private UserProfileDTO resolveMe(String username) {
        String cacheKey = "USER_PROFILE:" + username;
        UserProfileDTO cached = redisService.get(cacheKey, UserProfileDTO.class);
        if (cached != null) {
            return cached;
        }
        AuthMeResponse authMe = grpcAuthClient.authMe(username);
        UserProfileResponse userProfile = grpcProfileClient.getUserProfile(
            UserProfileIdRequest.newBuilder().setUserId(username).build()
        );
        UserProfileDTO dto = UserProfileMapper.getInstance().toUserProfileDTO(authMe, userProfile);
        redisService.set(cacheKey, dto, 1, TimeUnit.HOURS);
        return dto;
    }
}
