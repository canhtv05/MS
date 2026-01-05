package com.leaf.graphql_bff.profile.mapper;

import com.leaf.common.grpc.AuthMeResponse;
import com.leaf.common.grpc.UserProfileResponse;
import com.leaf.common.utils.ConvertProto;
import com.leaf.graphql_bff.profile.dto.AuthMeDTO;
import com.leaf.graphql_bff.profile.dto.ProfileDTO;
import com.leaf.graphql_bff.profile.dto.UserProfileDTO;

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
            .id(ConvertProto.nullToEmpty(response.getId()))
            .userId(ConvertProto.nullToEmpty(response.getUserId()))
            .fullname(ConvertProto.nullToEmpty(response.getFullname()))
            .bio(ConvertProto.nullToEmpty(response.getBio()))
            .coverUrl(ConvertProto.nullToEmpty(response.getCoverUrl()))
            .avatarUrl(ConvertProto.nullToEmpty(response.getAvatarUrl()))
            .createdDate(ConvertProto.convertTimestampToInstant(response.getCreatedDate()).toString())
            .lastOnlineAt(ConvertProto.convertTimestampToInstant(response.getLastOnlineAt()).toString())
            .followersCount(response.getFollowersCount())
            .followingCount(response.getFollowingCount())
            .build();
    }
}
