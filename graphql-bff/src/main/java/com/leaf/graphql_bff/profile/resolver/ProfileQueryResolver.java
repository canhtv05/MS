package com.leaf.graphql_bff.profile.resolver;

import com.leaf.common.grpc.UserProfileIdRequest;
import com.leaf.common.grpc.UserProfileIntroduceDTO;
import com.leaf.common.grpc.UserProfilePrivacyDTO;
import com.leaf.common.grpc.UserProfileResponse;
import com.leaf.graphql_bff.profile.client.ProfileGrpcProfileClient;
import com.leaf.graphql_bff.profile.dto.DetailUserProfileDTO;
import com.leaf.graphql_bff.profile.mapper.UserProfileMapper;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@DgsComponent
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class ProfileQueryResolver {

    ProfileGrpcProfileClient grpcProfileClient;

    @DgsQuery(field = "userDetail")
    public Mono<DetailUserProfileDTO> userDetail(String username) {
        Mono<UserProfileResponse> userProfileMono = Mono.fromCallable(() ->
            grpcProfileClient.getUserProfile(UserProfileIdRequest.newBuilder().setUserId(username).build())
        ).subscribeOn(Schedulers.boundedElastic());

        Mono<UserProfileIntroduceDTO> userProfileIntroduceMono = Mono.fromCallable(() ->
            grpcProfileClient.getUserProfileIntroduce(UserProfileIdRequest.newBuilder().setUserId(username).build())
        ).subscribeOn(Schedulers.boundedElastic());

        Mono<UserProfilePrivacyDTO> userProfilePrivacyMono = Mono.fromCallable(() ->
            grpcProfileClient.getUserProfilePrivacy(UserProfileIdRequest.newBuilder().setUserId(username).build())
        ).subscribeOn(Schedulers.boundedElastic());

        return Mono.zip(userProfileMono, userProfileIntroduceMono, userProfilePrivacyMono).map(tuple -> {
            UserProfileResponse userProfileResponse = tuple.getT1();
            UserProfileIntroduceDTO userProfileIntroduceDTO = tuple.getT2();
            UserProfilePrivacyDTO userProfilePrivacyDTO = tuple.getT3();
            return UserProfileMapper.getInstance().toDetailUserProfileDTO(
                userProfileResponse,
                userProfileIntroduceDTO,
                userProfilePrivacyDTO
            );
        });
    }
}
