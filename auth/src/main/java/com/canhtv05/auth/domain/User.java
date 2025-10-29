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

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User extends AbstractAuditingEntity {

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
    @ManyToMany
    @JoinTable(name = "user_roles", joinColumns = {
            @JoinColumn(name = "user_id", referencedColumnName = "id") }, inverseJoinColumns = {
                    @JoinColumn(name = "role_code", referencedColumnName = "code") })
    @Builder.Default
    private Set<Role> roles = new HashSet<>();
}
