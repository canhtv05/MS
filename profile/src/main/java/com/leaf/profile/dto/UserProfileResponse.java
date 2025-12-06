package com.leaf.profile.dto;

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
    LocalDate dob;
    String city;
    Gender gender;
    String bio;
    String coverUrl;
    String phoneNumber;
    String avatarUrl;
    List<String> socialLinks;
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
