package com.leaf.profile.controller;

import com.leaf.common.dto.ResponseObject;
import com.leaf.profile.dto.SendFriendRequestDTO;
import com.leaf.profile.dto.UserProfileResponse;
import com.leaf.profile.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
}
