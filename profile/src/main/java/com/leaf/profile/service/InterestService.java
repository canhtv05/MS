package com.leaf.profile.service;

import com.leaf.common.dto.PageResponse;
import com.leaf.common.dto.search.SearchRequest;
import com.leaf.common.dto.search.SearchResponse;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.utils.CommonUtils;
import com.leaf.framework.service.CommonService;
import com.leaf.profile.domain.Interest;
import com.leaf.profile.domain.UserProfile;
import com.leaf.profile.dto.CreateInterestReq;
import com.leaf.profile.dto.InterestDTO;
import com.leaf.profile.dto.UserProfileUpdateInterestReq;
import com.leaf.profile.repository.InterestRepository;
import com.leaf.profile.repository.UserProfileRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
public class InterestService {

    private final InterestRepository interestRepository;
    private final UserProfileRepository userProfileRepository;

    @Transactional(readOnly = true)
    public SearchResponse<InterestDTO> searchData(SearchRequest searchRequest) {
        Page<Interest> pageInterest = interestRepository.findAll(
            searchRequest.searchText(),
            searchRequest.toPageable()
        );
        var content = pageInterest.stream().map(InterestDTO::toInterestDTO).toList();
        PageResponse pageResponse = PageResponse.builder()
            .currentPage(searchRequest.page())
            .size(searchRequest.size())
            .total(pageInterest.getTotalElements())
            .totalPages(pageInterest.getTotalPages())
            .count(content.size())
            .build();
        return new SearchResponse<>(content, pageResponse);
    }

    @Transactional
    public InterestDTO createInterest(CreateInterestReq req) {
        String currentUserLogin = CommonService.getCurrentUserLogin();
        Interest saved = interestRepository.createIfNotExists(
            CommonUtils.toSlug(req.getTitle()),
            req.getTitle(),
            req.getColor(),
            currentUserLogin,
            currentUserLogin
        );
        return InterestDTO.toInterestDTO(saved);
    }

    @Transactional
    public void updateUserProfileInterest(UserProfileUpdateInterestReq req) {
        String currentUserLogin = CommonService.getCurrentUserLogin();
        UserProfile userProfile = userProfileRepository
            .findByUserId(currentUserLogin)
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));
        List<Interest> interests = interestRepository.findAllById(req.getInterestIds());
        userProfile.getIntroduce().getInterests().clear();
        userProfile.getIntroduce().getInterests().addAll(interests);
        userProfileRepository.save(userProfile);
    }
}
