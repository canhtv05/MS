package com.leaf.auth.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.leaf.common.domain.AbstractAuditingPostgresEntity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User extends AbstractAuditingPostgresEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(name = "user_seq", allocationSize = 1)
    private Long id;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @JsonIgnore
    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "activated", nullable = false)
    @Builder.Default
    private boolean activated = false;

    @Column(name = "is_global", nullable = false)
    @Builder.Default
    private Boolean isGlobal = false;

    @JsonIgnore
    @Column(name = "refresh_token", columnDefinition = "TEXT")
    String refreshToken;

    @JsonIgnore
    @ManyToMany
    @JoinTable(name = "user_roles", joinColumns = {
            @JoinColumn(name = "user_id", referencedColumnName = "id") }, inverseJoinColumns = {
                    @JoinColumn(name = "role_code", referencedColumnName = "code") })
    @Builder.Default
    private Set<Role> roles = new HashSet<>();
}
