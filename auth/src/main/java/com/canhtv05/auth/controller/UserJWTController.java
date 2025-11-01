package com.canhtv05.auth.controller;

import com.canhtv05.auth.dto.UserProfileDTO;
import com.canhtv05.auth.dto.req.ChangePasswordReq;
import com.canhtv05.auth.dto.req.LoginRequest;
import com.canhtv05.auth.dto.res.RefreshTokenResponse;
import com.canhtv05.auth.dto.res.TokenResponse;
import com.canhtv05.auth.dto.res.VerifyTokenResponse;
import com.canhtv05.auth.service.AuthService;
import com.canhtv05.auth.service.UserService;
import com.canhtv05.common.exceptions.ResponseObject;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
            HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        String jwt = authService.authenticate(loginRequest, httpServletRequest, httpServletResponse);
        return new ResponseEntity<>(new TokenResponse(jwt), HttpStatus.OK);
    }

    @PostMapping("/p/refresh-token")
    public ResponseEntity<ResponseObject<RefreshTokenResponse>> refreshToken(
            @CookieValue(name = "auth") String cookieValue,
            HttpServletRequest httpServletRequest, HttpServletResponse response) {
        return ResponseEntity
                .ok(ResponseObject.success(authService.refreshToken(cookieValue, httpServletRequest, response)));
    }

    @PostMapping("/internal/verify")
    public ResponseEntity<ResponseObject<VerifyTokenResponse>> verifyToken(
            @CookieValue(name = "auth") String cookieValue) {
        return ResponseEntity.ok(ResponseObject.success(authService.verifyToken(cookieValue)));
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
    public ResponseEntity<ResponseObject<?>> logout(@CookieValue(name = "auth") String cookieValue,
            HttpServletResponse response) {
        authService.logout(cookieValue, response);
        return ResponseEntity.ok(ResponseObject.success());
    }
}
