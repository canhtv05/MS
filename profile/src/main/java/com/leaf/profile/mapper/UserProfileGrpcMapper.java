package com.leaf.profile.mapper;

import com.leaf.common.grpc.UserProfileDTO;
import com.leaf.common.utils.CommonUtils;
import com.leaf.common.utils.ConvertProto;
import com.leaf.profile.dto.UserProfileCreationReq;
import com.leaf.profile.dto.UserProfileResponse;
import java.time.Instant;

public class UserProfileGrpcMapper {

    private static final UserProfileGrpcMapper INSTANCE = new UserProfileGrpcMapper();

    private UserProfileGrpcMapper() {}

    public static UserProfileGrpcMapper getInstance() {
        return INSTANCE;
    }

    public UserProfileCreationReq toUserProfileCreationReq(UserProfileDTO grpcRequest) {
        if (grpcRequest == null) {
            return null;
        }
        return UserProfileCreationReq.builder()
            .userId(grpcRequest.getUserId())
            .fullname(grpcRequest.getFullname())
            .build();
    }

    public com.leaf.common.grpc.UserProfileResponse toGrpcUserProfileResponse(UserProfileResponse response) {
        if (response == null) {
            return null;
        }

        com.leaf.common.grpc.UserProfileResponse.Builder builder = com.leaf.common.grpc.UserProfileResponse.newBuilder()
            .setId(CommonUtils.getSafeObject(response.getId(), String.class, ""))
            .setUserId(CommonUtils.getSafeObject(response.getUserId(), String.class, ""))
            .setFullname(CommonUtils.getSafeObject(response.getFullname(), String.class, ""))
            .setBio(CommonUtils.getSafeObject(response.getBio(), String.class, ""))
            .setCoverUrl(CommonUtils.getSafeObject(response.getCoverUrl(), String.class, ""))
            .setAvatarUrl(CommonUtils.getSafeObject(response.getAvatarUrl(), String.class, ""))
            .setFollowersCount(CommonUtils.getSafeObject(response.getFollowersCount(), Long.class, 0L))
            .setFollowingCount(CommonUtils.getSafeObject(response.getFollowingCount(), Long.class, 0L))
            .setLastOnlineAt(
                ConvertProto.convertInstantToTimestamp(
                    CommonUtils.getSafeObject(response.getLastOnlineAt(), Instant.class, Instant.now())
                )
            )
            .setCreatedDate(
                ConvertProto.convertInstantToTimestamp(
                    CommonUtils.getSafeObject(response.getCreatedDate(), Instant.class, Instant.now())
                )
            );
        return builder.build();
    }

    public UserProfileDTO toGrpcUserProfileDTO(UserProfileResponse response) {
        if (response == null) {
            return null;
        }
        return UserProfileDTO.newBuilder()
            .setUserId(CommonUtils.getSafeObject(response.getUserId(), String.class, ""))
            .setFullname(CommonUtils.getSafeObject(response.getFullname(), String.class, ""))
            .build();
    }
}
