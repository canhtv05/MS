package com.leaf.profile.mapper;

import com.leaf.common.grpc.UserProfileDTO;
import com.leaf.framework.blocking.util.CommonUtil;
import com.leaf.framework.blocking.util.ConvertProto;
import com.leaf.profile.dto.req.UserProfileCreationReq;
import com.leaf.profile.dto.res.UserProfileResponse;
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
            .setId(CommonUtil.getSafeObject(response.getId(), String.class, ""))
            .setUserId(CommonUtil.getSafeObject(response.getUserId(), String.class, ""))
            .setFullname(CommonUtil.getSafeObject(response.getFullname(), String.class, ""))
            .setBio(CommonUtil.getSafeObject(response.getBio(), String.class, ""))
            .setCoverUrl(CommonUtil.getSafeObject(response.getCoverUrl(), String.class, ""))
            .setAvatarUrl(CommonUtil.getSafeObject(response.getAvatarUrl(), String.class, ""))
            .setFollowersCount(CommonUtil.getSafeObject(response.getFollowersCount(), Long.class, 0L))
            .setFollowingCount(CommonUtil.getSafeObject(response.getFollowingCount(), Long.class, 0L))
            .setLastOnlineAt(
                ConvertProto.convertInstantToTimestamp(
                    CommonUtil.getSafeObject(response.getLastOnlineAt(), Instant.class, Instant.now())
                )
            )
            .setCreatedDate(
                ConvertProto.convertInstantToTimestamp(
                    CommonUtil.getSafeObject(response.getCreatedDate(), Instant.class, Instant.now())
                )
            );
        return builder.build();
    }

    public UserProfileDTO toGrpcUserProfileDTO(UserProfileResponse response) {
        if (response == null) {
            return null;
        }
        return UserProfileDTO.newBuilder()
            .setUserId(CommonUtil.getSafeObject(response.getUserId(), String.class, ""))
            .setFullname(CommonUtil.getSafeObject(response.getFullname(), String.class, ""))
            .build();
    }
}
