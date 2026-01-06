package com.leaf.graphql_bff.auth.resolver;

import com.leaf.common.grpc.AuthMeResponse;
import com.leaf.common.grpc.UserProfileIdRequest;
import com.leaf.common.grpc.UserProfileResponse;
import com.leaf.framework.service.RedisService;
import com.leaf.graphql_bff.auth.client.AuthGrpcAuthClient;
import com.leaf.graphql_bff.auth.client.AuthGrpcProfileClient;
import com.leaf.graphql_bff.auth.dto.UserProfileDTO;
import com.leaf.graphql_bff.auth.mapper.UserProfileMapper;
import com.leaf.graphql_bff.util.SecurityUtils;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import java.util.concurrent.TimeUnit;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@DgsComponent
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AuthQueryResolver {

    AuthGrpcAuthClient grpcAuthClient;
    AuthGrpcProfileClient grpcProfileClient;
    RedisService redisService;

    @DgsQuery(field = "me")
    @PreAuthorize("isAuthenticated()")
    public Mono<UserProfileDTO> me() {
        return SecurityUtils.getCurrentUserLogin().flatMap(username -> {
            String cacheKey = "USER_PROFILE:" + username;
            UserProfileDTO cached = redisService.get(cacheKey, UserProfileDTO.class);
            if (cached != null) {
                return Mono.just(cached);
            }
            Mono<AuthMeResponse> authMono = Mono.fromCallable(() -> grpcAuthClient.authMe(username)).subscribeOn(
                Schedulers.boundedElastic()
            );

            Mono<UserProfileResponse> userProfileMono = Mono.fromCallable(() ->
                grpcProfileClient.getUserProfile(UserProfileIdRequest.newBuilder().setUserId(username).build())
            ).subscribeOn(Schedulers.boundedElastic());

            return Mono.zip(authMono, userProfileMono).map(tuple -> {
                UserProfileDTO userProfileDTO = UserProfileMapper.getInstance().toUserProfileDTO(
                    tuple.getT1(),
                    tuple.getT2()
                );
                redisService.set(cacheKey, userProfileDTO, 1, TimeUnit.HOURS);
                return userProfileDTO;
            });
        });
    }
}
