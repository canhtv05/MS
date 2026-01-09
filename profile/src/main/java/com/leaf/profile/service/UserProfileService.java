package com.leaf.profile.service;

import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.grpc.ImageResponse;
import com.leaf.common.grpc.ResourceType;
import com.leaf.framework.security.SecurityUtils;
import com.leaf.framework.service.RedisService;
import com.leaf.profile.domain.UserProfile;
import com.leaf.profile.dto.ChangeCoverByUrlReq;
import com.leaf.profile.dto.SendFriendRequestDTO;
import com.leaf.profile.dto.UserProfileCreationReq;
import com.leaf.profile.dto.UserProfileResponse;
import com.leaf.profile.grpc.GrpcFileClient;
import com.leaf.profile.repository.UserProfileRepository;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileService {

    UserProfileRepository userProfileRepository;
    GrpcFileClient grpcFileClient;
    RedisService redisService;
    ExecutorService executorService = Executors.newFixedThreadPool(2);

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
            String cacheKey = "USER_PROFILE:" + username;
            redisService.evict(cacheKey);
            return UserProfileResponse.toUserProfileResponse(saved);
        } catch (Exception e) {
            log.error("Error uploading cover image: {}", e.getMessage(), e);
            throw new ApiException(ErrorMessage.UNHANDLED_ERROR);
        }
    }

    public UserProfileResponse changeCoverImageFromMediaHistory(ChangeCoverByUrlReq req) throws InterruptedException {
        String username = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new ApiException(ErrorMessage.UNAUTHENTICATED)
        );
        List<Callable<Object>> tasks = List.of(() ->
            userProfileRepository
                .findByUserId(username)
                .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND))
        );

        List<Future<Object>> futures = executorService.invokeAll(tasks);
        try {
            UserProfile userProfile = (UserProfile) futures.get(0).get();
            userProfile.setCoverUrl(req.getUrl());
            userProfileRepository.save(userProfile);
            String cacheKey = "USER_PROFILE:" + username;
            redisService.evict(cacheKey);
            return UserProfileResponse.toUserProfileResponse(userProfile);
        } catch (Exception e) {
            throw new ApiException(ErrorMessage.UNHANDLED_ERROR);
        }
    }
}
