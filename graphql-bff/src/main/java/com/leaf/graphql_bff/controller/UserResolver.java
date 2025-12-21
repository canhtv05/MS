package com.leaf.graphql_bff.controller;

import com.leaf.common.grpc.AuthMeResponse;
import com.leaf.common.grpc.UserProfileIdRequest;
import com.leaf.common.grpc.UserProfileResponse;
import com.leaf.graphql_bff.dto.UserProfileDTO;
import com.leaf.graphql_bff.grpc.GrpcAuthClient;
import com.leaf.graphql_bff.grpc.GrpcUserProfileClient;
import com.leaf.graphql_bff.mapper.UserProfileMapper;
import com.leaf.graphql_bff.util.SecurityUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Controller
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class UserResolver {

    GrpcAuthClient grpcAuthClient;
    GrpcUserProfileClient grpcUserProfileClient;

    @QueryMapping("me")
    @PreAuthorize("isAuthenticated()")
    public Mono<UserProfileDTO> me() {
        return SecurityUtils.getCurrentUserLogin().flatMap(username -> {
            Mono<AuthMeResponse> authMono = Mono.fromCallable(() -> grpcAuthClient.authMe(username)).subscribeOn(
                Schedulers.boundedElastic()
            );
            Mono<UserProfileResponse> userProfileMono = Mono.fromCallable(() ->
                grpcUserProfileClient.getUserProfile(UserProfileIdRequest.newBuilder().setUserId(username).build())
            ).subscribeOn(Schedulers.boundedElastic());

            return Mono.zip(authMono, userProfileMono).map(tuple ->
                UserProfileMapper.getInstance().toUserProfileDTO(tuple.getT1(), tuple.getT2())
            );
        });
    }
}
