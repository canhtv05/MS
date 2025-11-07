package com.leaf.profile.service;

import org.springframework.stereotype.Service;

import com.leaf.profile.domain.UserProfile;
import com.leaf.profile.dto.UserProfileCreationReq;
import com.leaf.profile.dto.UserProfileResponse;
import com.leaf.profile.repository.UserProfileRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileService {

    UserProfileRepository userProfileRepository;

    public UserProfileResponse createUserProfile(UserProfileCreationReq req) {
        UserProfile userProfile = UserProfile.builder()
                .userId(req.getUserId())
                .email(req.getEmail())
                .username(req.getUserId())
                .build();

        var UserProfile = userProfileRepository.save(userProfile);
        return UserProfileResponse.toUserProfileResponse(UserProfile);
    }
}
