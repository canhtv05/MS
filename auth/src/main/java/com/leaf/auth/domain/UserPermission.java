package com.leaf.auth.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

import com.leaf.auth.enums.PermissionAction;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@Entity
@Table(name = "user_permission")
public class UserPermission extends AbstractAuditingEntity {

    @Id
    @Column(name = "id", unique = true, nullable = false)
    @Builder.Default
    private String id = UUID.randomUUID().toString();

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "permission_code", nullable = false)
    private String permissionCode;

    @Column(name = "action", nullable = false)
    @Enumerated(EnumType.STRING)
    private PermissionAction action;

    @ManyToOne
    @JoinColumn(name = "permission_code", updatable = false, insertable = false)
    private Permission permission;
}
