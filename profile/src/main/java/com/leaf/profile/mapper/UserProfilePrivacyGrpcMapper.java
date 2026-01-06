package com.leaf.profile.mapper;

import com.leaf.common.grpc.PrivacyLevel;
import com.leaf.common.utils.CommonUtils;
import com.leaf.profile.dto.UserProfilePrivacyDTO;

public class UserProfilePrivacyGrpcMapper {

    private static final UserProfilePrivacyGrpcMapper INSTANCE = new UserProfilePrivacyGrpcMapper();

    private UserProfilePrivacyGrpcMapper() {}

    public static UserProfilePrivacyGrpcMapper getInstance() {
        return INSTANCE;
    }

    public com.leaf.common.grpc.UserProfilePrivacyDTO toGrpcUserProfilePrivacyDTO(UserProfilePrivacyDTO response) {
        if (response == null) {
            return null;
        }
        return com.leaf.common.grpc.UserProfilePrivacyDTO.newBuilder()
            .setId(CommonUtils.getSafeObject(response.getId(), String.class, ""))
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
