package com.leaf.profile.dto;

import org.springframework.beans.BeanUtils;

import com.leaf.profile.domain.UserProfile;

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

  Long userId;
  String username;
  String email;

  public static UserProfileResponse toUserProfileResponse(UserProfile userProfile) {
    UserProfileResponse response = new UserProfileResponse();
    BeanUtils.copyProperties(userProfile, response);
    return response;
  }
}
