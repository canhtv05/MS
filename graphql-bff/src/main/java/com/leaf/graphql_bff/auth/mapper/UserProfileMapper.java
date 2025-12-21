package com.leaf.graphql_bff.auth.mapper;

import com.leaf.common.grpc.AuthMeResponse;
import com.leaf.common.grpc.UserProfileResponse;
import com.leaf.common.utils.ConvertProto;
import com.leaf.graphql_bff.auth.dto.AuthMeDTO;
import com.leaf.graphql_bff.auth.dto.ProfileDTO;
import com.leaf.graphql_bff.auth.dto.UserProfileDTO;

public class UserProfileMapper {

    private static UserProfileMapper instance;

    public static UserProfileMapper getInstance() {
        if (instance == null) {
            instance = new UserProfileMapper();
        }
        return instance;
    }

    public UserProfileDTO toUserProfileDTO(AuthMeResponse authMeResponse, UserProfileResponse userProfileResponse) {
        if (authMeResponse == null || userProfileResponse == null) {
            return null;
        }

        return UserProfileDTO.builder()
            .auth(toAuthMeDTO(authMeResponse))
            .profile(toProfileDTO(userProfileResponse))
            .build();
    }

    private AuthMeDTO toAuthMeDTO(AuthMeResponse response) {
        return AuthMeDTO.builder()
            .username(ConvertProto.nullToEmpty(response.getUsername()))
            .fullName(ConvertProto.nullToEmpty(response.getFullname()))
            .email(ConvertProto.nullToEmpty(response.getEmail()))
            .isGlobal(response.getIsGlobal())
            .roles(response.getRolesList())
            .roleLabels(response.getRoleLabelsList())
            .permissions(response.getPermissionsList())
            .secretKey(ConvertProto.nullToEmpty(response.getSecretKey()))
            .channel(ConvertProto.nullToEmpty(response.getChannel()))
            .build();
    }

    private ProfileDTO toProfileDTO(UserProfileResponse response) {
        return ProfileDTO.builder()
            .userId(ConvertProto.nullToEmpty(response.getUserId()))
            .fullname(ConvertProto.nullToEmpty(response.getFullname()))
            .dob(ConvertProto.convertTimestampToLocalDate(response.getDob()).toString())
            .city(ConvertProto.nullToEmpty(response.getCity()))
            .bio(ConvertProto.nullToEmpty(response.getBio()))
            .coverUrl(ConvertProto.nullToEmpty(response.getCoverUrl()))
            .avatarUrl(ConvertProto.nullToEmpty(response.getAvatarUrl()))
            .gender(response.getGender())
            .phoneNumber(ConvertProto.nullToEmpty(response.getPhoneNumber()))
            .createdDate(ConvertProto.convertTimestampToInstant(response.getCreatedDate()).toString())
            .lastOnlineAt(ConvertProto.convertTimestampToInstant(response.getLastOnlineAt()).toString())
            .tiktokUrl(ConvertProto.nullToEmpty(response.getTiktokUrl()))
            .fbUrl(ConvertProto.nullToEmpty(response.getFbUrl()))
            .profileVisibility(response.getProfileVisibility())
            .friendsVisibility(response.getFriendsVisibility())
            .postsVisibility(response.getPostsVisibility())
            .followersCount(response.getFollowersCount())
            .followingCount(response.getFollowingCount())
            .build();
    }
}
