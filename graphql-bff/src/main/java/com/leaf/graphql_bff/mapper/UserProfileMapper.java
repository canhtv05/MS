package com.leaf.graphql_bff.mapper;

import com.leaf.common.grpc.AuthMeResponse;
import com.leaf.common.grpc.UserProfileResponse;
import com.leaf.common.utils.ConvertProto;
import com.leaf.graphql_bff.dto.UserProfileDTO;

public class UserProfileMapper {

    public static UserProfileMapper getInstance() {
        return new UserProfileMapper();
    }

    public UserProfileDTO toUserProfileDTO(AuthMeResponse authMeResponse, UserProfileResponse userProfileResponse) {
        if (authMeResponse == null) {
            return null;
        }

        return UserProfileDTO.builder()
            .username(ConvertProto.nullToEmpty(authMeResponse.getUsername()))
            .fullName(ConvertProto.nullToEmpty(authMeResponse.getFullname()))
            .email(ConvertProto.nullToEmpty(authMeResponse.getEmail()))
            .isGlobal(authMeResponse.getIsGlobal())
            .roles(authMeResponse.getRolesList())
            .roleLabels(authMeResponse.getRoleLabelsList())
            .permissions(authMeResponse.getPermissionsList())
            .secretKey(ConvertProto.nullToEmpty(authMeResponse.getSecretKey()))
            .channel(ConvertProto.nullToEmpty(authMeResponse.getChannel()))
            .dob(ConvertProto.convertTimestampToLocalDate(userProfileResponse.getDob()).toString())
            .city(ConvertProto.nullToEmpty(userProfileResponse.getCity()))
            .bio(ConvertProto.nullToEmpty(userProfileResponse.getBio()))
            .coverUrl(ConvertProto.nullToEmpty(userProfileResponse.getCoverUrl()))
            .avatarUrl(ConvertProto.nullToEmpty(userProfileResponse.getAvatarUrl()))
            .gender(userProfileResponse.getGender())
            .phoneNumber(ConvertProto.nullToEmpty(userProfileResponse.getPhoneNumber()))
            .createdDate(ConvertProto.convertTimestampToInstant(userProfileResponse.getCreatedDate()).toString())
            .lastOnlineAt(ConvertProto.convertTimestampToInstant(userProfileResponse.getLastOnlineAt()).toString())
            .tiktokUrl(ConvertProto.nullToEmpty(userProfileResponse.getTiktokUrl()))
            .fbUrl(ConvertProto.nullToEmpty(userProfileResponse.getFbUrl()))
            .profileVisibility(userProfileResponse.getProfileVisibility())
            .friendsVisibility(userProfileResponse.getFriendsVisibility())
            .postsVisibility(userProfileResponse.getPostsVisibility())
            .followersCount(userProfileResponse.getFollowersCount())
            .followingCount(userProfileResponse.getFollowingCount())
            .build();
    }
}
