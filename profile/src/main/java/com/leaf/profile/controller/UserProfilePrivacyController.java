package com.leaf.profile.controller;

import com.leaf.common.dto.ResponseObject;
import com.leaf.profile.dto.PrivacyDTO;
import com.leaf.profile.service.UserProfilePrivacyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserProfilePrivacyController {

    private final UserProfilePrivacyService userProfilePrivacyService;

    @PostMapping("/me/update-privacy")
    public ResponseEntity<ResponseObject<PrivacyDTO>> updatePrivacy(@Valid @RequestBody PrivacyDTO req) {
        return ResponseEntity.ok(ResponseObject.success(userProfilePrivacyService.updateUserProfilePrivacy(req)));
    }
}
