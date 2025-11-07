package com.leaf.auth.controller;

import com.leaf.auth.dto.UserDTO;
import com.leaf.auth.dto.UserProfileDTO;
import com.leaf.auth.dto.req.ChangePasswordReq;
import com.leaf.auth.dto.req.LoginRequest;
import com.leaf.auth.dto.res.RefreshTokenResponse;
import com.leaf.auth.dto.res.TokenResponse;
import com.leaf.auth.dto.res.VerifyTokenResponse;
import com.leaf.auth.service.AuthService;
import com.leaf.auth.service.UserService;
import com.leaf.common.constant.Constants;
import com.leaf.common.dto.ResponseObject;

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
@RequiredArgsConstructor
@RequestMapping("/me")
public class UserJWTController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/p/authenticate")
    public ResponseEntity<TokenResponse> authorize(@Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        String jwt = authService.authenticate(loginRequest, httpServletRequest, httpServletResponse);
        return new ResponseEntity<>(new TokenResponse(jwt), HttpStatus.OK);
    }

    @PostMapping("/p/refresh-token")
    public ResponseEntity<ResponseObject<RefreshTokenResponse>> refreshToken(
            @CookieValue(name = Constants.COOKIE_NAME) String cookieValue,
            HttpServletRequest httpServletRequest, HttpServletResponse response) {
        return ResponseEntity
                .ok(ResponseObject.success(authService.refreshToken(cookieValue, httpServletRequest, response)));
    }

    @PostMapping("/internal/verify")
    public ResponseEntity<ResponseObject<VerifyTokenResponse>> verifyToken(
            @CookieValue(name = Constants.COOKIE_NAME) String cookieValue) {
        return ResponseEntity.ok(ResponseObject.success(authService.verifyToken(cookieValue)));
    }

    @PostMapping("/c/create")
    public ResponseEntity<ResponseObject<UserDTO>> createUser(@Valid @RequestBody UserDTO userDTO) {
        UserDTO newUserDTO = userService.createUser(userDTO, false);
        return ResponseEntity.ok(ResponseObject.success(newUserDTO));
    }

    @GetMapping
    public ResponseEntity<ResponseObject<UserProfileDTO>> getUserProfile() {
        return ResponseEntity.ok(ResponseObject.success(authService.getProfile()));
    }

    @PostMapping("/p/change-password")
    public ResponseEntity<ResponseObject<Boolean>> changePassword(@RequestBody ChangePasswordReq req) {
        userService.changePassword(req);
        return ResponseEntity.ok(ResponseObject.success());
    }

    @PostMapping("/p/update")
    public ResponseEntity<ResponseObject<Boolean>> updateUserProfile(@RequestBody UserProfileDTO req) {
        userService.updateUserProfile(req);
        return ResponseEntity.ok(ResponseObject.success());
    }

    @PostMapping("/p/logout")
    public ResponseEntity<ResponseObject<?>> logout(@CookieValue(name = Constants.COOKIE_NAME) String cookieValue,
            HttpServletResponse response) {
        authService.logout(cookieValue, response);
        return ResponseEntity.ok(ResponseObject.success());
    }
}
