package com.leaf.auth.mapper;

import com.leaf.auth.dto.UserProfileDTO;
import com.leaf.common.grpc.AuthMeResponse;
import com.leaf.common.utils.CommonUtils;

public class AuthGrpcMapper {

    private static final AuthGrpcMapper INSTANCE = new AuthGrpcMapper();

    private AuthGrpcMapper() {}

    public static AuthGrpcMapper getInstance() {
        return INSTANCE;
    }

    public AuthMeResponse toAuthMeResponse(UserProfileDTO userProfile) {
        AuthMeResponse.Builder builder = AuthMeResponse.newBuilder()
            .setUsername(CommonUtils.getSafeObject(userProfile.getUsername(), String.class, ""))
            .setEmail(CommonUtils.getSafeObject(userProfile.getEmail(), String.class, ""))
            .setIsGlobal(Boolean.TRUE.equals(userProfile.getIsGlobal()))
            .addAllRoles(userProfile.getRoles().stream().map(String::toString).toList())
            .addAllRoleLabels(userProfile.getRoleLabels().stream().map(String::toString).toList())
            .addAllPermissions(userProfile.getPermissions().stream().map(String::toString).toList())
            .setSecretKey(CommonUtils.getSafeObject(userProfile.getSecretKey(), String.class, ""))
            .setChannel(CommonUtils.getSafeObject(userProfile.getChannel(), String.class, ""));
        return builder.build();
    }
}
