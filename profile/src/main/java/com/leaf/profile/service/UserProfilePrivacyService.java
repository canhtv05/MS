package com.leaf.profile.service;

import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.framework.security.SecurityUtils;
import com.leaf.profile.domain.UserProfilePrivacy;
import com.leaf.profile.dto.UpdatePrivacyReq;
import com.leaf.profile.dto.UserProfilePrivacyDTO;
import com.leaf.profile.repository.UserProfilePrivacyRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfilePrivacyService {

    UserProfilePrivacyRepository userProfilePrivacyRepository;

    public UserProfilePrivacyDTO getUserProfilePrivacy(String userId) {
        UserProfilePrivacy userProfilePrivacy = userProfilePrivacyRepository
            .findByUserId(userId)
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));
        return UserProfilePrivacyDTO.toUserProfilePrivacyDTO(userProfilePrivacy);
    }

    public void updateUserProfilePrivacy(UpdatePrivacyReq req) {
        String userId = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new ApiException(ErrorMessage.UNAUTHENTICATED)
        );
        UserProfilePrivacy userProfilePrivacy = userProfilePrivacyRepository
            .findByUserId(userId)
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));
        userProfilePrivacy.setProfileVisibility(req.getProfileVisibility());
        userProfilePrivacy.setFriendsVisibility(req.getFriendsVisibility());
        userProfilePrivacy.setPostsVisibility(req.getPostsVisibility());
        userProfilePrivacyRepository.save(userProfilePrivacy);
    }
}
