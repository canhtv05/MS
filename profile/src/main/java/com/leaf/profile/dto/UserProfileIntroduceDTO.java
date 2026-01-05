package com.leaf.profile.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.leaf.common.utils.json.InstantToStringSerializer;
import com.leaf.profile.domain.UserProfile;
import java.time.Instant;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileIntroduceDTO {

    String id;
    String userId;
    String fullname;

    // @JsonSerialize(using = LocalDateToStringSerializer.class)
    // LocalDate dob;
    // String city;
    // Gender gender;
    // String phoneNumber;
    // String tiktokUrl;
    // String xUrl;
    // String instagramUrl;
    // String facebookUrl;

    @JsonSerialize(using = InstantToStringSerializer.class)
    Instant createdDate;

    String avatarUrl;
    String bio;
    String coverUrl;
    Instant lastOnlineAt;
    Long followersCount;
    Long followingCount;

    public static UserProfileResponse toUserProfileResponse(UserProfile userProfile) {
        UserProfileResponse.UserProfileResponseBuilder builder = UserProfileResponse.builder()
            .id(userProfile.getId())
            .userId(userProfile.getUserId())
            .fullname(userProfile.getFullname())
            .bio(userProfile.getBio())
            .createdDate(userProfile.getCreatedDate())
            .lastOnlineAt(userProfile.getLastOnlineAt())
            .followersCount(userProfile.getFollowersCount())
            .followingCount(userProfile.getFollowingCount())
            .coverUrl(userProfile.getCoverUrl())
            .avatarUrl(userProfile.getAvatarUrl());
        return builder.build();
    }
}
