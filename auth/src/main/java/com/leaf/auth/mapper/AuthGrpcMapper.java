package com.leaf.auth.mapper;

import com.leaf.auth.dto.UserProfileDTO;
import com.leaf.common.grpc.AuthMeResponse;
import com.leaf.framework.blocking.util.CommonUtil;

public class AuthGrpcMapper {

    private static final AuthGrpcMapper INSTANCE = new AuthGrpcMapper();

    private AuthGrpcMapper() {}

    public static AuthGrpcMapper getInstance() {
        return INSTANCE;
    }

    public AuthMeResponse toAuthMeResponse(UserProfileDTO userProfile) {
        AuthMeResponse.Builder builder = AuthMeResponse.newBuilder()
            .setUsername(CommonUtil.getSafeObject(userProfile.getUsername(), String.class, ""))
            .setEmail(CommonUtil.getSafeObject(userProfile.getEmail(), String.class, ""))
            .setIsGlobal(Boolean.TRUE.equals(userProfile.getIsGlobal()))
            .addAllRoles(userProfile.getRoles().stream().map(String::toString).toList())
            .addAllRoleLabels(userProfile.getRoleLabels().stream().map(String::toString).toList())
            .addAllPermissions(userProfile.getPermissions().stream().map(String::toString).toList())
            .setSecretKey(CommonUtil.getSafeObject(userProfile.getSecretKey(), String.class, ""))
            .setChannel(CommonUtil.getSafeObject(userProfile.getChannel(), String.class, ""));
        return builder.build();
    }
}
