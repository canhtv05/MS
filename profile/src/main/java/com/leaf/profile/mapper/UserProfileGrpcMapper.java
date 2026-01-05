package com.leaf.profile.mapper;

import com.leaf.common.grpc.UserProfileDTO;
import com.leaf.common.utils.CommonUtils;
import com.leaf.profile.dto.UserProfileCreationReq;
import com.leaf.profile.dto.UserProfileResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface UserProfileGrpcMapper {
    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "fullname", source = "fullname")
    UserProfileCreationReq toUserProfileCreationReq(UserProfileDTO grpcRequest);

    default com.leaf.common.grpc.UserProfileResponse toGrpcUserProfileResponse(UserProfileResponse response) {
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
            .setFollowingCount(CommonUtils.getSafeObject(response.getFollowingCount(), Long.class, 0L));

        return builder.build();
    }

    default UserProfileDTO toGrpcUserProfileDTO(UserProfileResponse response) {
        if (response == null) {
            return null;
        }
        return UserProfileDTO.newBuilder()
            .setUserId(CommonUtils.getSafeObject(response.getUserId(), String.class, ""))
            .setFullname(CommonUtils.getSafeObject(response.getFullname(), String.class, ""))
            .build();
    }
}
