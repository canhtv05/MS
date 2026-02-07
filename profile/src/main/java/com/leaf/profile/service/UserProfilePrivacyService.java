package com.leaf.profile.service;

import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.framework.security.SecurityUtils;
import com.leaf.profile.domain.UserProfilePrivacy;
import com.leaf.profile.dto.PrivacyDTO;
import com.leaf.profile.dto.UserProfilePrivacyDTO;
import com.leaf.profile.repository.UserProfilePrivacyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
public class UserProfilePrivacyService {

    private final UserProfilePrivacyRepository userProfilePrivacyRepository;

    @Transactional(readOnly = true)
    public UserProfilePrivacyDTO getUserProfilePrivacy(String userId) {
        UserProfilePrivacy userProfilePrivacy = userProfilePrivacyRepository
            .findByUserId(userId)
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));
        return UserProfilePrivacyDTO.toUserProfilePrivacyDTO(userProfilePrivacy);
    }

    @Transactional
    public PrivacyDTO updateUserProfilePrivacy(PrivacyDTO req) {
        String userId = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new ApiException(ErrorMessage.UNAUTHENTICATED)
        );
        UserProfilePrivacy userProfilePrivacy = userProfilePrivacyRepository
            .findByUserId(userId)
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));
        userProfilePrivacy.setProfileVisibility(req.getProfileVisibility());
        userProfilePrivacy.setFriendsVisibility(req.getFriendsVisibility());
        userProfilePrivacy.setPostsVisibility(req.getPostsVisibility());
        userProfilePrivacy.setIntroduceVisibility(req.getIntroduceVisibility());
        userProfilePrivacy.setGalleryVisibility(req.getGalleryVisibility());
        userProfilePrivacyRepository.save(userProfilePrivacy);
        return PrivacyDTO.toPrivacyDTO(userProfilePrivacy);
    }
}
