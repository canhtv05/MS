package com.canhtv05.auth.domain;

import com.canhtv05.common.domain.AbstractAuditingEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@SuperBuilder
@NoArgsConstructor
@Entity
@Table(name = "roles")
public class Role extends AbstractAuditingEntity {

    @Id
    @Column(name = "code", length = 50, unique = true, nullable = false)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @ManyToMany(mappedBy = "roles")
    Set<User> users;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "role_permissions",
            joinColumns = {@JoinColumn(name = "role_code", referencedColumnName = "code")},
            inverseJoinColumns = {@JoinColumn(name = "permission_code", referencedColumnName = "code")}
    )
    @Builder.Default
    private Set<Permission> permissions = new HashSet<>();
}
