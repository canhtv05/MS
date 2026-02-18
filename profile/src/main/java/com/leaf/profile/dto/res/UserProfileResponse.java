package com.leaf.profile.dto.res;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.leaf.common.utils.json.InstantToStringSerializer;
import com.leaf.profile.domain.UserProfile;
import java.io.Serializable;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserProfileResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    String id;
    String userId;
    String fullname;

    @JsonSerialize(using = InstantToStringSerializer.class)
    Instant createdDate;

    String avatarUrl;
    String bio;
    String coverUrl;

    @JsonSerialize(using = InstantToStringSerializer.class)
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
            .lastOnlineAt(userProfile.getLastOnlineAt())
            .createdDate(userProfile.getCreatedDate())
            .coverUrl(userProfile.getCoverUrl())
            .avatarUrl(userProfile.getAvatarUrl());
        return builder.build();
    }
}
