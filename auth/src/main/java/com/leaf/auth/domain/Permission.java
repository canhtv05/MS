package com.leaf.auth.domain;

import com.leaf.common.domain.AbstractAuditingEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Setter
@Getter
@SuperBuilder
@NoArgsConstructor
@Entity
@Table(name = "permissions")
public class Permission extends AbstractAuditingEntity {

    @Id
    @Column(name = "code", length = 50, unique = true, nullable = false)
    private String code;

    @Column(name = "type", length = 20, nullable = false)
    private String type;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "module", nullable = false)
    private String module;

    @Column(name = "method", length = 50)
    private String method;

    @Column(name = "path_pattern")
    private String pathPattern;

    @Column(name = "is_global", nullable = false)
    @Builder.Default
    private Boolean isGlobal = false;

}
