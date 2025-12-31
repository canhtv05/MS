package com.leaf.profile.controller;

import com.leaf.common.dto.ResponseObject;
import com.leaf.profile.dto.ChangeCoverByUrlReq;
import com.leaf.profile.dto.SendFriendRequestDTO;
import com.leaf.profile.dto.UserProfileResponse;
import com.leaf.profile.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @PostMapping("/friend-request")
    public ResponseEntity<ResponseObject<SendFriendRequestDTO>> sendFriendRequest(
        @RequestBody SendFriendRequestDTO request
    ) {
        return ResponseEntity.ok(ResponseObject.success(userProfileService.sendFriendRequestDTO(request)));
    }

    @GetMapping("/me")
    public ResponseEntity<ResponseObject<UserProfileResponse>> getUserProfile() {
        return ResponseEntity.ok(ResponseObject.success(userProfileService.getUserProfile()));
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<ResponseObject<UserProfileResponse>> getUserProfile(@PathVariable String username) {
        return ResponseEntity.ok(ResponseObject.success(userProfileService.getUserProfile(username)));
    }

    @PostMapping(value = "/me/change-cover-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseObject<UserProfileResponse>> changeCoverImage(
        @RequestParam(name = "file", required = true) MultipartFile file
    ) {
        return ResponseEntity.ok(ResponseObject.success(userProfileService.changeAvatarOrCoverImage(file, false)));
    }

    @PostMapping(value = "/me/change-avatar-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseObject<UserProfileResponse>> changeAvatarImage(
        @RequestParam(name = "file", required = true) MultipartFile file
    ) {
        return ResponseEntity.ok(ResponseObject.success(userProfileService.changeAvatarOrCoverImage(file, true)));
    }

    @PostMapping(value = "/me/change-cover-image-from-media-history")
    public ResponseEntity<ResponseObject<UserProfileResponse>> changeCoverImageFromMediaHistory(
        @Valid @RequestBody ChangeCoverByUrlReq req
    ) throws InterruptedException {
        return ResponseEntity.ok(ResponseObject.success(userProfileService.changeCoverImageFromMediaHistory(req)));
    }
}
