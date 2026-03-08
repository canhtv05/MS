package com.leaf.profile.mapper;

import com.leaf.common.grpc.UserProfileGrpcDTO;
import com.leaf.common.grpc.UserProfileGrpcResponse;
import com.leaf.framework.blocking.util.CommonUtils;
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

    public UserProfileCreationReq toUserProfileCreationReq(UserProfileGrpcDTO grpcRequest) {
        if (grpcRequest == null) {
            return null;
        }
        return UserProfileCreationReq.builder()
            .userId(grpcRequest.getUserId())
            .fullname(grpcRequest.getFullname())
            .build();
    }

    public UserProfileGrpcResponse toGrpcUserProfileResponse(UserProfileResponse response) {
        if (response == null) {
            return null;
        }

        UserProfileGrpcResponse.Builder builder = UserProfileGrpcResponse.newBuilder()
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

    public UserProfileGrpcDTO toGrpcUserProfileDTO(UserProfileResponse response) {
        if (response == null) {
            return null;
        }
        return UserProfileGrpcDTO.newBuilder()
            .setUserId(CommonUtils.getSafeObject(response.getUserId(), String.class, ""))
            .setFullname(CommonUtils.getSafeObject(response.getFullname(), String.class, ""))
            .build();
    }
}
