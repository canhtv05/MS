package com.leaf.profile.mapper;

import com.leaf.common.grpc.PrivacyLevel;
import com.leaf.framework.blocking.util.CommonUtil;
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
            .setId(CommonUtil.getSafeObject(response.getId(), String.class, ""))
            .setUserId(CommonUtil.getSafeObject(response.getUserId(), String.class, ""))
            .setFriendsVisibility(
                CommonUtil.getSafeObject(
                    response.getFriendsVisibility(),
                    PrivacyLevel.class,
                    PrivacyLevel.PRIVACY_LEVEL_PUBLIC
                )
            )
            .setProfileVisibility(
                CommonUtil.getSafeObject(
                    response.getProfileVisibility(),
                    PrivacyLevel.class,
                    PrivacyLevel.PRIVACY_LEVEL_PUBLIC
                )
            )
            .setPostsVisibility(
                CommonUtil.getSafeObject(
                    response.getPostsVisibility(),
                    PrivacyLevel.class,
                    PrivacyLevel.PRIVACY_LEVEL_PUBLIC
                )
            )
            .setIntroduceVisibility(
                CommonUtil.getSafeObject(
                    response.getIntroduceVisibility(),
                    PrivacyLevel.class,
                    PrivacyLevel.PRIVACY_LEVEL_PUBLIC
                )
            )
            .setGalleryVisibility(
                CommonUtil.getSafeObject(
                    response.getGalleryVisibility(),
                    PrivacyLevel.class,
                    PrivacyLevel.PRIVACY_LEVEL_PUBLIC
                )
            )
            .build();
    }
}
