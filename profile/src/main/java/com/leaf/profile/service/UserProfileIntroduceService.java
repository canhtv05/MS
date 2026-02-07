package com.leaf.profile.service;

import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.profile.domain.UserProfileIntroduce;
import com.leaf.profile.dto.UserProfileIntroduceDTO;
import com.leaf.profile.repository.UserProfileIntroduceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
public class UserProfileIntroduceService {

    private final UserProfileIntroduceRepository userProfileIntroduceRepository;

    @Transactional(readOnly = true)
    public UserProfileIntroduceDTO getUserProfileIntroduce(String userId) {
        UserProfileIntroduce userProfileIntroduce = userProfileIntroduceRepository
            .findByUserId(userId)
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));
        return UserProfileIntroduceDTO.toUserProfileIntroduceDTO(userProfileIntroduce);
    }
}
