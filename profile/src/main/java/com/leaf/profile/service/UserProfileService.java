package com.leaf.profile.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.leaf.common.exceptions.ApiException;
import com.leaf.common.exceptions.ErrorMessage;
import com.leaf.common.security.SecurityUtils;
import com.leaf.profile.domain.UserProfile;
import com.leaf.profile.dto.SendFriendRequestDTO;
import com.leaf.profile.dto.UserProfileCreationReq;
import com.leaf.profile.dto.UserProfileResponse;
import com.leaf.profile.repository.UserProfileRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileService {

    UserProfileRepository userProfileRepository;

    public UserProfileResponse createUserProfile(UserProfileCreationReq req) {
        if (userProfileRepository.existsByEmail(req.getEmail())) {
            throw new ApiException(ErrorMessage.EMAIL_ALREADY_EXITS);
        }

        UserProfile userProfile = UserProfile.builder()
                .userId(req.getUserId())
                .email(req.getEmail())
                .username(req.getUserId())
                .build();

        var UserProfile = userProfileRepository.save(userProfile);
        return UserProfileResponse.toUserProfileResponse(UserProfile);
    }

    public SendFriendRequestDTO sendFriendRequestDTO(SendFriendRequestDTO request) {
        // String username = SecurityUtils.getCurrentUserLogin()
        // .orElseThrow(() -> new ApiException(ErrorMessage.UNAUTHENTICATED));

        var object = SecurityContextHolder.getContext().getAuthentication();
        String username = "admin";

        log.info("ob: {}", object);

        Long currentUserId = userProfileRepository.findByUserId(username)
                .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));

        return userProfileRepository.sendFriendRequest(currentUserId, request.getReceiverId());
    }

    public UserProfile getUserProfile() {
        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new ApiException(ErrorMessage.UNAUTHENTICATED));

        return userProfileRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));
    }
}
