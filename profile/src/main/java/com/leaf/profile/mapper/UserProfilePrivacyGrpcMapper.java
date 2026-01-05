package com.leaf.profile.mapper;

import com.leaf.common.grpc.PrivacyLevel;
import com.leaf.common.utils.CommonUtils;
import com.leaf.profile.dto.UserProfilePrivacyDTO;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface UserProfilePrivacyGrpcMapper {
    default com.leaf.common.grpc.UserProfilePrivacyDTO toGrpcUserProfilePrivacyDTO(UserProfilePrivacyDTO response) {
        if (response == null) {
            return null;
        }
        return com.leaf.common.grpc.UserProfilePrivacyDTO.newBuilder()
            .setUserId(CommonUtils.getSafeObject(response.getUserId(), String.class, ""))
            .setFriendsVisibility(
                CommonUtils.getSafeObject(
                    response.getFriendsVisibility(),
                    PrivacyLevel.class,
                    PrivacyLevel.PRIVACY_LEVEL_PUBLIC
                )
            )
            .setProfileVisibility(
                CommonUtils.getSafeObject(
                    response.getProfileVisibility(),
                    PrivacyLevel.class,
                    PrivacyLevel.PRIVACY_LEVEL_PUBLIC
                )
            )
            .setPostsVisibility(
                CommonUtils.getSafeObject(
                    response.getPostsVisibility(),
                    PrivacyLevel.class,
                    PrivacyLevel.PRIVACY_LEVEL_PUBLIC
                )
            )
            .build();
    }
}
