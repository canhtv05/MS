package com.leaf.profile.service;

import com.leaf.common.enums.CacheKey;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.grpc.ImageResponse;
import com.leaf.common.grpc.ResourceType;
import com.leaf.framework.blocking.config.cache.RedisCacheService;
import com.leaf.framework.blocking.security.SecurityUtils;
import com.leaf.profile.domain.UserProfile;
import com.leaf.profile.dto.ChangeCoverByUrlReq;
import com.leaf.profile.dto.SendFriendRequestDTO;
import com.leaf.profile.dto.UpdateBioProfileReq;
import com.leaf.profile.dto.UserProfileCreationReq;
import com.leaf.profile.dto.UserProfileResponse;
import com.leaf.profile.grpc.GrpcFileClient;
import com.leaf.profile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final GrpcFileClient grpcFileClient;
    private final RedisCacheService redisService;

    @Transactional
    public UserProfileResponse createUserProfile(UserProfileCreationReq req) {
        UserProfile userProfile = UserProfile.builder().userId(req.getUserId()).fullname(req.getFullname()).build();

        var saved = userProfileRepository.save(userProfile);
        return UserProfileResponse.toUserProfileResponse(saved);
    }

    @Transactional
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

    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile() {
        String username = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new ApiException(ErrorMessage.UNAUTHENTICATED)
        );

        UserProfile userProfile = userProfileRepository
            .findByUserId(username)
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));

        return UserProfileResponse.toUserProfileResponse(userProfile);
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(String username) {
        UserProfile userProfile = userProfileRepository
            .findByUserId(username)
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));

        return UserProfileResponse.toUserProfileResponse(userProfile);
    }

    @Transactional
    public UserProfileResponse changeAvatarOrCoverImage(MultipartFile file, boolean isAvatar) {
        try {
            String username = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
                new ApiException(ErrorMessage.UNAUTHENTICATED)
            );
            UserProfile userProfile = userProfileRepository
                .findByUserId(username)
                .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));

            ImageResponse res = grpcFileClient.uploadImage(
                file,
                isAvatar ? ResourceType.RESOURCE_TYPE_AVATAR : ResourceType.RESOURCE_TYPE_COVER,
                username
            );
            if (isAvatar) {
                userProfile.setAvatarUrl(res.getImageUrl());
            } else {
                userProfile.setCoverUrl(res.getImageUrl());
            }
            UserProfile saved = userProfileRepository.save(userProfile);
            String cacheKey = CacheKey.USER_PROFILE.name() + ":" + username;
            redisService.evict(cacheKey);
            return UserProfileResponse.toUserProfileResponse(saved);
        } catch (Exception e) {
            log.error("Error uploading cover image: {}", e.getMessage(), e);
            throw new ApiException(ErrorMessage.UNHANDLED_ERROR);
        }
    }

    @Transactional
    public UserProfileResponse changeCoverImageFromMediaHistory(ChangeCoverByUrlReq req) throws InterruptedException {
        String username = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new ApiException(ErrorMessage.UNAUTHENTICATED)
        );
        var userProfile = userProfileRepository
            .findByUserId(username)
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));
        userProfile.setCoverUrl(req.getUrl());
        var saved = userProfileRepository.save(userProfile);
        String cacheKey = CacheKey.USER_PROFILE.name() + ":" + username;
        redisService.evict(cacheKey);
        return UserProfileResponse.toUserProfileResponse(saved);
    }

    @Transactional
    public UserProfileResponse updateBioProfile(UpdateBioProfileReq req) {
        String username = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new ApiException(ErrorMessage.UNAUTHENTICATED)
        );
        UserProfile userProfile = userProfileRepository
            .findByUserId(username)
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));
        userProfile.setBio(req.getBio());
        UserProfile saved = userProfileRepository.save(userProfile);
        String cacheKey = CacheKey.USER_PROFILE.name() + ":" + username;
        redisService.evict(cacheKey);
        return UserProfileResponse.toUserProfileResponse(saved);
    }
}
