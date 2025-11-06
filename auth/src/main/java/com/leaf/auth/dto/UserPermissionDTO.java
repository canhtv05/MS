package com.leaf.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

import com.leaf.auth.domain.UserPermission;
import com.leaf.auth.enums.PermissionAction;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class UserPermissionDTO {

    private String permissionCode;
    private PermissionAction action;

    public UserPermission toEntity(Long userId) {
        return UserPermission.builder()
                .id(UUID.randomUUID().toString())
                .userId(userId)
                .permissionCode(this.permissionCode)
                .action(this.action)
                .build();
    }
}
