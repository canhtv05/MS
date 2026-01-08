package com.leaf.graphql_bff.profile.resolver;

import com.leaf.common.grpc.UserProfileIdRequest;
import com.leaf.graphql_bff.profile.client.ProfileGrpcProfileClient;
import com.leaf.graphql_bff.profile.dto.DetailUserProfileDTO;
import com.leaf.graphql_bff.profile.dto.UserProfileIntroduceDTO;
import com.leaf.graphql_bff.profile.dto.UserProfilePrivacyDTO;
import com.leaf.graphql_bff.profile.mapper.UserProfileMapper;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;
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
        return Mono.fromCallable(() ->
            grpcProfileClient.getUserProfile(UserProfileIdRequest.newBuilder().setUserId(username).build())
        )
            .subscribeOn(Schedulers.boundedElastic())
            .flatMap(userProfileResponse ->
                Mono.justOrEmpty(UserProfileMapper.getInstance().toDetailUserProfileDTO(userProfileResponse))
            );
    }

    @DgsData(parentType = "DetailUserProfileDTO", field = "introduce")
    public Mono<UserProfileIntroduceDTO> introduce(DgsDataFetchingEnvironment dfe) {
        DetailUserProfileDTO parent = dfe.getSource();
        return Mono.fromCallable(() ->
            grpcProfileClient.getUserProfileIntroduce(
                UserProfileIdRequest.newBuilder().setUserId(parent.getUserId()).build()
            )
        )
            .subscribeOn(Schedulers.boundedElastic())
            .flatMap(introduce ->
                Mono.justOrEmpty(UserProfileMapper.getInstance().toUserProfileIntroduceDTO(introduce))
            );
    }

    @DgsData(parentType = "DetailUserProfileDTO", field = "privacy")
    public Mono<UserProfilePrivacyDTO> privacy(DgsDataFetchingEnvironment dfe) {
        DetailUserProfileDTO parent = dfe.getSource();
        return Mono.fromCallable(() ->
            grpcProfileClient.getUserProfilePrivacy(
                UserProfileIdRequest.newBuilder().setUserId(parent.getUserId()).build()
            )
        )
            .subscribeOn(Schedulers.boundedElastic())
            .flatMap(privacy -> Mono.justOrEmpty(UserProfileMapper.getInstance().toUserProfilePrivacyDTO(privacy)));
    }
}
