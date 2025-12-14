package com.leaf.auth.dto;

import com.leaf.auth.domain.Role;
import com.leaf.auth.domain.User;
import com.leaf.common.grpc.Gender;
import com.leaf.common.grpc.PrivacyLevel;
import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
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
public class UserProfileDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String username;
    private String fullName;
    private String email;
    private Boolean isGlobal;
    private List<String> roles;
    private List<String> roleLabels;
    private List<String> permissions;
    private String secretKey;
    private String channel;

    // profile service
    private LocalDate dob;
    private String city;
    private String bio;
    private String coverUrl;
    private String avatarUrl;
    private Gender gender;
    private String phoneNumber;
    private Instant createdDate;
    private Instant lastOnlineAt;
    private String tiktokUrl;
    private String fbUrl;
    private PrivacyLevel profileVisibility;
    private PrivacyLevel friendsVisibility;
    private PrivacyLevel postsVisibility;
    private Long followersCount;
    private Long followingCount;

    public static UserProfileDTO fromEntity(User user) {
        return UserProfileDTO.builder()
            .username(user.getUsername())
            .isGlobal(user.getIsGlobal())
            .roles(user.getRoles().stream().map(Role::getCode).collect(Collectors.toList()))
            .roleLabels(user.getRoles().stream().map(Role::getDescription).collect(Collectors.toList()))
            .fullName(user.getFullName())
            .email(user.getEmail())
            .build();
    }
}
