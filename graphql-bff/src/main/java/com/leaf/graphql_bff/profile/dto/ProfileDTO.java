package com.leaf.graphql_bff.profile.dto;

import com.leaf.common.grpc.Gender;
import com.leaf.common.grpc.PrivacyLevel;
import java.io.Serializable;
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
public class ProfileDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;
    private String userId;
    private String fullname;
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
    private String xUrl;
    private String instagramUrl;
    private String facebookUrl;
    private PrivacyLevel profileVisibility;
    private PrivacyLevel friendsVisibility;
    private PrivacyLevel postsVisibility;
    private Long followersCount;
    private Long followingCount;
}
