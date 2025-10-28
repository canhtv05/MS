package com.canhtv05.auth.controller;

import com.canhtv05.auth.dto.ChangePasswordReq;
import com.canhtv05.auth.dto.TokenResponse;
import com.canhtv05.auth.dto.LoginRequest;
import com.canhtv05.auth.dto.UserProfileDTO;
import com.canhtv05.auth.service.AuthService;
import com.canhtv05.auth.service.UserService;
import com.canhtv05.common.exceptions.ResponseObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserJWTController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/authenticate")
    public ResponseEntity<TokenResponse> authorize(@Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest httpServletRequest) {
        String jwt = authService.authenticate(loginRequest, httpServletRequest);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(HttpHeaders.AUTHORIZATION, "Bearer " + jwt);
        return new ResponseEntity<>(new TokenResponse(jwt), httpHeaders, HttpStatus.OK);
    }

    @GetMapping("/user-profile")
    public ResponseEntity<ResponseObject<UserProfileDTO>> getUserProfile() {
        return ResponseEntity.ok(ResponseObject.success(authService.getProfile()));
    }

    @PostMapping("/p/change-password")
    public ResponseEntity<ResponseObject<Boolean>> changePassword(@RequestBody ChangePasswordReq req) {
        userService.changePassword(req);
        return ResponseEntity.ok(ResponseObject.success());
    }

    @PostMapping("/p/update-user-profile")
    public ResponseEntity<ResponseObject<Boolean>> updateUserProfile(@RequestBody UserProfileDTO req) {
        userService.updateUserProfile(req);
        return ResponseEntity.ok(ResponseObject.success());
    }

    @PostMapping("/p/logout")
    public ResponseEntity<ResponseObject<?>> logout(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String bearerToken) {
        authService.logout(bearerToken);
        return ResponseEntity.ok(ResponseObject.success());
    }

}
