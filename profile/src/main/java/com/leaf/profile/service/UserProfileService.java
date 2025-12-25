package com.leaf.profile.service;

import com.leaf.common.dto.PageResponse;
import com.leaf.common.dto.search.SearchRequest;
import com.leaf.common.dto.search.SearchResponse;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.grpc.ImageResponse;
import com.leaf.common.grpc.ResourceType;
import com.leaf.framework.security.SecurityUtils;
import com.leaf.profile.domain.MediaHistory;
import com.leaf.profile.domain.UserProfile;
import com.leaf.profile.dto.MediaHistoryDTO;
import com.leaf.profile.dto.SendFriendRequestDTO;
import com.leaf.profile.dto.UserProfileCreationReq;
import com.leaf.profile.dto.UserProfileResponse;
import com.leaf.profile.grpc.GrpcFileClient;
import com.leaf.profile.repository.MediaHistoryRepository;
import com.leaf.profile.repository.UserProfileRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileService {

    UserProfileRepository userProfileRepository;
    MediaHistoryRepository mediaHistoryRepository;
    GrpcFileClient grpcFileClient;

    public UserProfileResponse createUserProfile(UserProfileCreationReq req) {
        UserProfile userProfile = UserProfile.builder().userId(req.getUserId()).fullname(req.getFullname()).build();

        var UserProfile = userProfileRepository.save(userProfile);
        return UserProfileResponse.toUserProfileResponse(UserProfile);
    }

    public SendFriendRequestDTO sendFriendRequestDTO(SendFriendRequestDTO request) {
        String userId = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new ApiException(ErrorMessage.UNAUTHENTICATED)
        );

        String currentUserId = userProfileRepository
            .findByUserIdReturnString(userId)
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));

        if (userProfileRepository.isSent(currentUserId, request.getReceiverId())) {
            throw new ApiException(ErrorMessage.FRIEND_REQUEST_ALREADY_SENT);
        }

        return userProfileRepository.sendFriendRequest(currentUserId, request.getReceiverId());
    }

    public UserProfileResponse getUserProfile() {
        String username = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new ApiException(ErrorMessage.UNAUTHENTICATED)
        );

        UserProfile userProfile = userProfileRepository
            .findByUserId(username)
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));

        return UserProfileResponse.toUserProfileResponse(userProfile);
    }

    public UserProfileResponse getUserProfile(String username) {
        UserProfile userProfile = userProfileRepository
            .findByUserId(username)
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));

        return UserProfileResponse.toUserProfileResponse(userProfile);
    }

    public UserProfileResponse changeCoverImage(MultipartFile file) {
        try {
            String username = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
                new ApiException(ErrorMessage.UNAUTHENTICATED)
            );
            UserProfile userProfile = userProfileRepository
                .findByUserId(username)
                .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));

            ImageResponse res = grpcFileClient.uploadImage(file, ResourceType.COVER, username);
            userProfile.setCoverUrl(res.getImageUrl());
            mediaHistoryRepository.saveMediaHistory(username, res.getImageUrl(), ResourceType.COVER.name());
            UserProfile saved = userProfileRepository.save(userProfile);

            return UserProfileResponse.toUserProfileResponse(saved);
        } catch (Exception e) {
            log.error("Error uploading cover image: {}", e.getMessage(), e);
            throw new ApiException(ErrorMessage.UNHANDLED_ERROR);
        }
    }

    public SearchResponse<MediaHistoryDTO> searchMediaHistory(SearchRequest searchRequest) {
        String username = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new ApiException(ErrorMessage.UNAUTHENTICATED)
        );

        Pageable pageable = searchRequest.toPageable(Sort.Direction.DESC, "createdAt");

        Page<MediaHistory> page;
        if (StringUtils.isNotBlank(searchRequest.searchText())) {
            page = mediaHistoryRepository.searchByUserIdAndText(username, searchRequest.searchText(), pageable);
        } else {
            page = mediaHistoryRepository.findByUserId(username, pageable);
        }

        var res = page.getContent().stream().map(MediaHistoryDTO::toMediaHistoryDTO).toList();
        PageResponse pageResponse = PageResponse.builder()
            .currentPage(page.getNumber())
            .totalPages(page.getTotalPages())
            .size(page.getSize())
            .count(page.getNumberOfElements())
            .total(page.getTotalElements())
            .build();
        return new SearchResponse<>(res, pageResponse);
    }
}
