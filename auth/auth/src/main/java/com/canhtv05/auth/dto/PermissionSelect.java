package com.canhtv05.auth.dto;

import com.canhtv05.auth.domain.Permission;

public record PermissionSelect(
        String code,
        String type,
        String module,
        String method,
        String pathPattern,
        Boolean isGlobal
) {
    public static PermissionSelect fromEntity(Permission permission) {
        return new PermissionSelect(
                permission.getCode(),
                permission.getType(),
                permission.getModule(),
                permission.getMethod(),
                permission.getPathPattern(),
                permission.getIsGlobal()
        );
    }
}