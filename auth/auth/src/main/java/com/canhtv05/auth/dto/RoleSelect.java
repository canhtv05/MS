package com.canhtv05.auth.dto;


import com.canhtv05.auth.domain.Role;

public record RoleSelect(
        String code,
        String name,
        String description
) {
    public static RoleSelect fromEntity(Role entity) {
        return new RoleSelect(
                entity.getCode(),
                entity.getName(),
                entity.getDescription()
        );
    }
}