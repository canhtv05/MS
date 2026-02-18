package com.leaf.profile.service;

import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.utils.CommonUtils;
import com.leaf.framework.blocking.service.CommonService;
import com.leaf.profile.domain.Interest;
import com.leaf.profile.domain.UserProfile;
import com.leaf.profile.domain.UserProfileIntroduce;
import com.leaf.profile.dto.UpdateProfileIntroduceDTO;
import com.leaf.profile.dto.UserProfileIntroduceDTO;
import com.leaf.profile.dto.req.UserProfileUpdateInterestReq;
import com.leaf.profile.repository.InterestRepository;
import com.leaf.profile.repository.UserProfileIntroduceRepository;
import com.leaf.profile.repository.UserProfileRepository;
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
    private final UserProfileRepository userProfileRepository;

    @Transactional(readOnly = true)
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
            log.error("Error: {}", e);
            throw new ApiException(ErrorMessage.UNHANDLED_ERROR);
        }
    }

    @Transactional
    public void updateUserProfileInterest(UserProfileUpdateInterestReq req) {
        String currentUserLogin = CommonService.getCurrentUserLogin();
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            List<Callable<Object>> tasks = List.of(
                () ->
                    userProfileRepository
                        .findByUserId(currentUserLogin)
                        .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND)),
                () -> interestRepository.findAllById(req.getInterestIds()),
                () ->
                    userProfileIntroduceRepository
                        .findByUserId(currentUserLogin)
                        .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND))
            );
            List<Future<Object>> futures = executor.invokeAll(tasks);
            UserProfile userProfile = (UserProfile) futures.get(0).get();
            @SuppressWarnings("unchecked")
            List<Interest> interests = (List<Interest>) futures.get(1).get();
            UserProfileIntroduce userProfileIntroduce = (UserProfileIntroduce) futures.get(2).get();
            userProfileIntroduce.getInterests().clear();
            userProfileIntroduce.getInterests().addAll(interests);
            userProfileIntroduceRepository.save(userProfileIntroduce);
            userProfileRepository.save(userProfile);
        } catch (Exception e) {
            log.error("Error: {}", e);
            throw new ApiException(ErrorMessage.UNHANDLED_ERROR);
        }
    }

    @Transactional
    public UserProfileIntroduceDTO updateUserProfileIntroduce(UpdateProfileIntroduceDTO req) {
        String currentUserLogin = CommonService.getCurrentUserLogin();
        UserProfileIntroduce userProfileIntroduce = userProfileIntroduceRepository
            .findByUserId(currentUserLogin)
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));

        CommonUtils.updateIfNotNull(req.getCity(), userProfileIntroduce::setCity);
        CommonUtils.updateIfNotNull(req.getHometown(), userProfileIntroduce::setHometown);
        CommonUtils.updateIfNotNull(req.getJobTitle(), userProfileIntroduce::setJobTitle);
        CommonUtils.updateIfNotNull(req.getCompany(), userProfileIntroduce::setCompany);
        CommonUtils.updateIfNotNull(req.getSchool(), userProfileIntroduce::setSchool);
        CommonUtils.updateIfNotNull(req.getWebsiteUrl(), userProfileIntroduce::setWebsiteUrl);
        CommonUtils.updateIfNotNull(req.getGithubUrl(), userProfileIntroduce::setGithubUrl);
        CommonUtils.updateIfNotNull(req.getLinkedinUrl(), userProfileIntroduce::setLinkedinUrl);
        CommonUtils.updateIfNotNull(req.getXUrl(), userProfileIntroduce::setXUrl);
        CommonUtils.updateIfNotNull(req.getInstagramUrl(), userProfileIntroduce::setInstagramUrl);
        CommonUtils.updateIfNotNull(req.getTiktokUrl(), userProfileIntroduce::setTiktokUrl);
        CommonUtils.updateIfNotNull(req.getFacebookUrl(), userProfileIntroduce::setFacebookUrl);
        CommonUtils.updateIfNotNull(req.getDob(), userProfileIntroduce::setDob);
        CommonUtils.updateIfNotNull(req.getGender(), userProfileIntroduce::setGender);
        CommonUtils.updateIfNotNull(req.getRelationshipStatus(), userProfileIntroduce::setRelationshipStatus);
        CommonUtils.updateIfNotNull(req.getPhoneNumber(), userProfileIntroduce::setPhoneNumber);

        UserProfileIntroduce saved = userProfileIntroduceRepository.save(userProfileIntroduce);
        return UserProfileIntroduceDTO.toUserProfileIntroduceDTO(saved);
    }
}
