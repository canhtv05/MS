package com.leaf.graphql_bff.auth.resolver;

import com.leaf.common.grpc.AuthMeResponse;
import com.leaf.common.grpc.UserProfileIdRequest;
import com.leaf.common.grpc.UserProfileResponse;
import com.leaf.graphql_bff.auth.client.GrpcAuthClient;
import com.leaf.graphql_bff.auth.client.GrpcProfileClient;
import com.leaf.graphql_bff.auth.dto.UserProfileDTO;
import com.leaf.graphql_bff.auth.mapper.UserProfileMapper;
import com.leaf.graphql_bff.util.SecurityUtils;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
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

    GrpcAuthClient grpcAuthClient;
    GrpcProfileClient grpcProfileClient;

    @DgsQuery(field = "me")
    @PreAuthorize("isAuthenticated()")
    public Mono<UserProfileDTO> me() {
        return SecurityUtils.getCurrentUserLogin().flatMap(username -> {
            Mono<AuthMeResponse> authMono = Mono.fromCallable(() -> grpcAuthClient.authMe(username)).subscribeOn(
                Schedulers.boundedElastic()
            );

            Mono<UserProfileResponse> userProfileMono = Mono.fromCallable(() ->
                grpcProfileClient.getUserProfile(UserProfileIdRequest.newBuilder().setUserId(username).build())
            ).subscribeOn(Schedulers.boundedElastic());

            return Mono.zip(authMono, userProfileMono).map(tuple ->
                UserProfileMapper.getInstance().toUserProfileDTO(tuple.getT1(), tuple.getT2())
            );
        });
    }
}
