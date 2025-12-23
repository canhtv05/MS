package com.leaf.auth.mapper;

import com.leaf.auth.dto.UserProfileDTO;
import com.leaf.common.grpc.AuthMeResponse;
import com.leaf.common.utils.ConvertProto;

public class AuthGrpcMapper {

    public static AuthGrpcMapper getInstance() {
        return new AuthGrpcMapper();
    }

    public AuthMeResponse toAuthMeResponse(UserProfileDTO userProfile) {
        AuthMeResponse.Builder builder = AuthMeResponse.newBuilder()
            .setUsername(ConvertProto.nullToEmpty(userProfile.getUsername()))
            .setEmail(ConvertProto.nullToEmpty(userProfile.getEmail()))
            .setIsGlobal(Boolean.TRUE.equals(userProfile.getIsGlobal()))
            .addAllRoles(userProfile.getRoles().stream().map(String::toString).toList())
            .addAllRoleLabels(userProfile.getRoleLabels().stream().map(String::toString).toList())
            .addAllPermissions(userProfile.getPermissions().stream().map(String::toString).toList())
            .setSecretKey(ConvertProto.nullToEmpty(userProfile.getSecretKey()))
            .setChannel(ConvertProto.nullToEmpty(userProfile.getChannel()));
        return builder.build();
    }
}
