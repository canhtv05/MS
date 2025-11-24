package com.leaf.profile.controller;

import org.springframework.web.bind.annotation.RestController;

import com.leaf.common.dto.ResponseObject;
import com.leaf.profile.dto.SendFriendRequestDTO;
import com.leaf.profile.dto.UserProfileResponse;
import com.leaf.profile.service.UserProfileService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @PostMapping("/friend-request")
    public ResponseEntity<ResponseObject<SendFriendRequestDTO>> sendFriendRequest(
            @RequestBody SendFriendRequestDTO request) {
        return ResponseEntity.ok(ResponseObject.success(userProfileService.sendFriendRequestDTO(request)));
    }

    @GetMapping("/me")
    public ResponseEntity<ResponseObject<UserProfileResponse>> getUserProfile() {
        return ResponseEntity.ok(ResponseObject.success(userProfileService.getUserProfile()));
    }
}
