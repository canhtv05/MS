package com.leaf.auth.dto;

import com.leaf.auth.domain.UserPermission;
import com.leaf.auth.enums.PermissionAction;
import java.io.Serializable;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class UserPermissionDTO implements Serializable {

    private static final long serialVersionUID = 1L;

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
