package com.canhtv05.auth.dto;

import com.canhtv05.auth.domain.Role;
import com.canhtv05.auth.domain.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String username;
    private String email;
    private Boolean isGlobal;
    private List<String> roles;
    private List<String> roleLabels;
    private List<String> permissions;

    public static UserProfileDTO fromEntity(User user) {
        return UserProfileDTO.builder()
                .username(user.getUsername())
                .isGlobal(user.getIsGlobal())
                .email(user.getEmail())
                .roles(user.getRoles().stream().map(Role::getCode).collect(Collectors.toList()))
                .roleLabels(user.getRoles().stream().map(Role::getDescription).collect(Collectors.toList()))
                .build();
    }
}
