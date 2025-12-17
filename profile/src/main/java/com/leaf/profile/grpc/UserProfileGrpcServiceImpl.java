package com.leaf.profile.grpc;

import com.google.protobuf.Timestamp;
import com.leaf.common.grpc.UserProfileDTO;
import com.leaf.common.grpc.UserProfileGrpcServiceGrpc;
import com.leaf.common.grpc.UserProfileIdRequest;
import com.leaf.common.utils.ConvertProto;
import com.leaf.profile.dto.UserProfileCreationReq;
import com.leaf.profile.dto.UserProfileResponse;
import com.leaf.profile.service.UserProfileService;
import io.grpc.stub.StreamObserver;
import java.util.Collections;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
@RequiredArgsConstructor
public class UserProfileGrpcServiceImpl extends UserProfileGrpcServiceGrpc.UserProfileGrpcServiceImplBase {

    private final UserProfileService userProfileService;

    @Override
    public void createUserProfile(UserProfileDTO request, StreamObserver<UserProfileDTO> responseObserver) {
        try {
            UserProfileCreationReq userProfileCreationReq = UserProfileCreationReq.builder()
                .userId(request.getUserId())
                .fullname(request.getFullname())
                .build();

            UserProfileResponse newUserProfile = userProfileService.createUserProfile(userProfileCreationReq);
            UserProfileDTO response = UserProfileDTO.newBuilder().setUserId(newUserProfile.getUserId()).build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(
                io.grpc.Status.ALREADY_EXISTS.withDescription(e.getMessage()).asRuntimeException()
            );
        }
    }

    @Override
    public void getUserProfile(
        UserProfileIdRequest request,
        StreamObserver<com.leaf.common.grpc.UserProfileResponse> responseObserver
    ) {
        try {
            UserProfileResponse userProfile = userProfileService.getUserProfile(request.getUserId());

            com.leaf.common.grpc.UserProfileResponse.Builder responseBuilder =
                com.leaf.common.grpc.UserProfileResponse.newBuilder()
                    .setUserId(userProfile.getUserId())
                    .setFullname(userProfile.getFullname() != null ? userProfile.getFullname() : "");

            if (Objects.nonNull(userProfile.getDob())) {
                Timestamp dobTimestamp = ConvertProto.convertLocalDateToTimestamp(userProfile.getDob());
                if (dobTimestamp != null) {
                    responseBuilder.setDob(dobTimestamp);
                }
            }

            if (Objects.nonNull(userProfile.getLastOnlineAt())) {
                Timestamp lastOnlineAtTimestamp = ConvertProto.convertInstantToTimestamp(userProfile.getLastOnlineAt());
                responseBuilder.setLastOnlineAt(lastOnlineAtTimestamp);
            }

            if (Objects.nonNull(userProfile.getCreatedDate())) {
                Timestamp createdDateTimestamp = ConvertProto.convertInstantToTimestamp(userProfile.getCreatedDate());
                responseBuilder.setCreatedDate(createdDateTimestamp);
            }

            if (Objects.nonNull(userProfile.getCity())) {
                responseBuilder.setCity(userProfile.getCity());
            }

            if (Objects.nonNull(userProfile.getBio())) {
                responseBuilder.setBio(userProfile.getBio());
            }

            if (Objects.nonNull(userProfile.getCoverUrl())) {
                responseBuilder.setCoverUrl(userProfile.getCoverUrl());
            }

            if (Objects.nonNull(userProfile.getAvatarUrl())) {
                responseBuilder.setAvatarUrl(userProfile.getAvatarUrl());
            }

            if (Objects.nonNull(userProfile.getPhoneNumber())) {
                responseBuilder.setPhoneNumber(userProfile.getPhoneNumber());
            }

            if (Objects.nonNull(userProfile.getTiktokUrl())) {
                responseBuilder.setPhoneNumber(userProfile.getTiktokUrl());
            }

            if (Objects.nonNull(userProfile.getFbUrl())) {
                responseBuilder.setPhoneNumber(userProfile.getFbUrl());
            }

            responseBuilder.setGender(convertGender(userProfile.getGender()));
            responseBuilder.setProfileVisibility(convertPrivacyLevel(userProfile.getProfileVisibility()));
            responseBuilder.setFriendsVisibility(convertPrivacyLevel(userProfile.getFriendsVisibility()));
            responseBuilder.setPostsVisibility(convertPrivacyLevel(userProfile.getPostsVisibility()));
            responseBuilder.setTiktokUrl(userProfile.getTiktokUrl());
            responseBuilder.setFbUrl(userProfile.getFbUrl());
            responseObserver.onNext(responseBuilder.build());
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(io.grpc.Status.NOT_FOUND.withDescription(e.getMessage()).asRuntimeException());
        }
    }

    private com.leaf.common.grpc.Gender convertGender(com.leaf.profile.enums.Gender gender) {
        if (gender == null) {
            return com.leaf.common.grpc.Gender.GENDER_UNSPECIFIED;
        }
        return switch (gender) {
            case MALE -> com.leaf.common.grpc.Gender.MALE;
            case FEMALE -> com.leaf.common.grpc.Gender.FEMALE;
            case OTHER -> com.leaf.common.grpc.Gender.OTHER;
        };
    }

    private com.leaf.common.grpc.PrivacyLevel convertPrivacyLevel(com.leaf.profile.enums.PrivacyLevel privacyLevel) {
        if (privacyLevel == null) {
            return com.leaf.common.grpc.PrivacyLevel.PRIVACY_LEVEL_UNSPECIFIED;
        }
        return switch (privacyLevel) {
            case PUBLIC -> com.leaf.common.grpc.PrivacyLevel.PUBLIC;
            case PRIVATE -> com.leaf.common.grpc.PrivacyLevel.PRIVATE;
            case CUSTOM -> com.leaf.common.grpc.PrivacyLevel.CUSTOM;
            case FRIENDS_ONLY -> com.leaf.common.grpc.PrivacyLevel.FRIEND_ONLY;
        };
    }
}
