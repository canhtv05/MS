package com.leaf.profile.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.leaf.common.grpc.Gender;
import com.leaf.common.grpc.PrivacyLevel;
import com.leaf.common.utils.json.InstantToStringSerializer;
import com.leaf.common.utils.json.LocalDateToStringSerializer;
import com.leaf.profile.domain.UserProfile;
import java.time.Instant;
import java.time.LocalDate;
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
public class UserProfileResponse {

    String id;
    String userId;

    @JsonSerialize(using = LocalDateToStringSerializer.class)
    LocalDate dob;

    String city;
    Gender gender;
    String bio;
    String coverUrl;
    String fullname;

    @JsonSerialize(using = InstantToStringSerializer.class)
    Instant createdDate;

    String phoneNumber;
    String avatarUrl;
    String tiktokUrl;
    String xUrl;
    String instagramUrl;
    String facebookUrl;
    PrivacyLevel profileVisibility;
    PrivacyLevel friendsVisibility;
    PrivacyLevel postsVisibility;
    Instant lastOnlineAt;
    Long followersCount;
    Long followingCount;

    public static UserProfileResponse toUserProfileResponse(UserProfile userProfile) {
        UserProfileResponse.UserProfileResponseBuilder builder = UserProfileResponse.builder()
            .id(userProfile.getId())
            .userId(userProfile.getUserId())
            .fullname(userProfile.getFullname())
            .dob(userProfile.getDob())
            .city(userProfile.getCity())
            .gender(userProfile.getGender())
            .bio(userProfile.getBio())
            .phoneNumber(userProfile.getPhoneNumber())
            .createdDate(userProfile.getCreatedDate())
            .lastOnlineAt(userProfile.getLastOnlineAt())
            .followersCount(userProfile.getFollowersCount())
            .followingCount(userProfile.getFollowingCount())
            .coverUrl(userProfile.getCoverUrl())
            .avatarUrl(userProfile.getAvatarUrl())
            .tiktokUrl(userProfile.getTiktokUrl())
            .xUrl(userProfile.getXUrl())
            .instagramUrl(userProfile.getInstagramUrl())
            .facebookUrl(userProfile.getFacebookUrl())
            .profileVisibility(userProfile.getProfileVisibility())
            .friendsVisibility(userProfile.getFriendsVisibility())
            .postsVisibility(userProfile.getPostsVisibility());
        return builder.build();
    }
}
