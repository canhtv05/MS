package com.leaf.graphql_bff.profile.dto;

import java.io.Serializable;
import java.time.OffsetDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DetailUserProfileDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    String id;
    String userId;
    String fullname;
    String bio;
    String coverUrl;
    String avatarUrl;
    UserProfileIntroduceDTO introduce;
    UserProfilePrivacyDTO privacy;
    OffsetDateTime lastOnlineAt;
    Long followersCount;
    Long followingCount;
    OffsetDateTime createdDate;
}
