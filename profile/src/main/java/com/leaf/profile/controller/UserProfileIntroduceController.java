package com.leaf.profile.controller;

import com.leaf.common.dto.ResponseObject;
import com.leaf.profile.dto.UpdateProfileIntroduceDTO;
import com.leaf.profile.dto.UserProfileIntroduceDTO;
import com.leaf.profile.dto.req.UserProfileUpdateInterestReq;
import com.leaf.profile.service.UserProfileIntroduceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserProfileIntroduceController {

    private final UserProfileIntroduceService userProfileIntroduceService;

    @PutMapping("/me/update-user-profile-interest")
    public ResponseEntity<ResponseObject<Void>> updateUserProfileInterest(
        @Valid @RequestBody UserProfileUpdateInterestReq req
    ) {
        userProfileIntroduceService.updateUserProfileInterest(req);
        return ResponseEntity.ok(ResponseObject.success());
    }

    @PutMapping("/me/update-user-profile-introduce")
    public ResponseEntity<ResponseObject<UserProfileIntroduceDTO>> updateUserProfileIntroduce(
        @Valid @RequestBody UpdateProfileIntroduceDTO req
    ) {
        return ResponseEntity.ok(ResponseObject.success(userProfileIntroduceService.updateUserProfileIntroduce(req)));
    }
}
