package com.leaf.graphql_bff.dto;

import com.leaf.common.grpc.Gender;
import com.leaf.common.grpc.PrivacyLevel;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {

    private String username;
    private String fullName;
    private String email;
    private Boolean isGlobal;
    private List<String> roles;
    private List<String> roleLabels;
    private List<String> permissions;
    private String secretKey;
    private String channel;
    private String dob;
    private String city;
    private String bio;
    private String coverUrl;
    private String avatarUrl;
    private Gender gender;
    private String phoneNumber;
    private String createdDate;
    private String lastOnlineAt;
    private String tiktokUrl;
    private String fbUrl;
    private PrivacyLevel profileVisibility;
    private PrivacyLevel friendsVisibility;
    private PrivacyLevel postsVisibility;
    private Long followersCount;
    private Long followingCount;
}
