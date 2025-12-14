package com.leaf.profile.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.leaf.common.utils.json.InstantToStringSerializer;
import com.leaf.common.utils.json.LocalDateToStringSerializer;
import com.leaf.profile.domain.UserProfile;
import com.leaf.profile.enums.Gender;
import com.leaf.profile.enums.PrivacyLevel;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.BeanUtils;

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
    String fbUrl;
    PrivacyLevel profileVisibility;
    PrivacyLevel friendsVisibility;
    PrivacyLevel postsVisibility;
    Instant lastOnlineAt;
    Long followersCount;
    Long followingCount;

    public static UserProfileResponse toUserProfileResponse(UserProfile userProfile) {
        UserProfileResponse response = new UserProfileResponse();
        BeanUtils.copyProperties(userProfile, response);
        return response;
    }
}
