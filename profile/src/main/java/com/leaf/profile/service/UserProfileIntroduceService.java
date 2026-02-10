package com.leaf.profile.service;

import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.profile.domain.Interest;
import com.leaf.profile.domain.UserProfileIntroduce;
import com.leaf.profile.dto.UserProfileIntroduceDTO;
import com.leaf.profile.repository.InterestRepository;
import com.leaf.profile.repository.UserProfileIntroduceRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
public class UserProfileIntroduceService {

    private final UserProfileIntroduceRepository userProfileIntroduceRepository;
    private final InterestRepository interestRepository;

    public UserProfileIntroduceDTO getUserProfileIntroduce(String userId) {
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            List<Callable<Object>> tasks = List.of(
                () ->
                    userProfileIntroduceRepository
                        .findByUserId(userId)
                        .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND)),
                () -> interestRepository.findInterestsByUserId(userId)
            );
            List<Future<Object>> results = executor.invokeAll(tasks);
            UserProfileIntroduce profile = (UserProfileIntroduce) results.get(0).get();
            @SuppressWarnings("unchecked")
            List<Interest> interests = (List<Interest>) results.get(1).get();
            if (CollectionUtils.isEmpty(interests)) {
                interests = new ArrayList<>();
            }
            profile.getInterests().addAll(interests);
            return UserProfileIntroduceDTO.toUserProfileIntroduceDTO(profile);
        } catch (Exception e) {
            throw new ApiException(ErrorMessage.UNHANDLED_ERROR);
        }
    }
}
