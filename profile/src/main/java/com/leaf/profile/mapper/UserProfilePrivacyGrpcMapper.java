package com.leaf.profile.mapper;

import com.leaf.common.grpc.PrivacyLevelGrpc;
import com.leaf.common.grpc.UserProfilePrivacyGrpcDTO;
import com.leaf.framework.blocking.util.CommonUtils;
import com.leaf.profile.dto.UserProfilePrivacyDTO;

public class UserProfilePrivacyGrpcMapper {

    private static final UserProfilePrivacyGrpcMapper INSTANCE = new UserProfilePrivacyGrpcMapper();

    private UserProfilePrivacyGrpcMapper() {}

    public static UserProfilePrivacyGrpcMapper getInstance() {
        return INSTANCE;
    }

    public UserProfilePrivacyGrpcDTO toGrpcUserProfilePrivacyDTO(UserProfilePrivacyDTO response) {
        if (response == null) {
            return null;
        }
        return UserProfilePrivacyGrpcDTO.newBuilder()
            .setId(CommonUtils.getSafeObject(response.getId(), String.class, ""))
            .setUserId(CommonUtils.getSafeObject(response.getUserId(), String.class, ""))
            .setFriendsVisibility(
                CommonUtils.getSafeObject(
                    response.getFriendsVisibility(),
                    PrivacyLevelGrpc.class,
                    PrivacyLevelGrpc.PRIVACY_LEVEL_PUBLIC
                )
            )
            .setProfileVisibility(
                CommonUtils.getSafeObject(
                    response.getProfileVisibility(),
                    PrivacyLevelGrpc.class,
                    PrivacyLevelGrpc.PRIVACY_LEVEL_PUBLIC
                )
            )
            .setPostsVisibility(
                CommonUtils.getSafeObject(
                    response.getPostsVisibility(),
                    PrivacyLevelGrpc.class,
                    PrivacyLevelGrpc.PRIVACY_LEVEL_PUBLIC
                )
            )
            .setIntroduceVisibility(
                CommonUtils.getSafeObject(
                    response.getIntroduceVisibility(),
                    PrivacyLevelGrpc.class,
                    PrivacyLevelGrpc.PRIVACY_LEVEL_PUBLIC
                )
            )
            .setGalleryVisibility(
                CommonUtils.getSafeObject(
                    response.getGalleryVisibility(),
                    PrivacyLevelGrpc.class,
                    PrivacyLevelGrpc.PRIVACY_LEVEL_PUBLIC
                )
            )
            .build();
    }
}
