package com.leaf.auth.controller;

import com.leaf.auth.dto.UserDTO;
import com.leaf.auth.dto.UserProfileDTO;
import com.leaf.auth.dto.req.ChangePasswordReq;
import com.leaf.auth.dto.req.ForgotPasswordReq;
import com.leaf.auth.dto.req.LoginReq;
import com.leaf.auth.dto.req.LogoutReq;
import com.leaf.auth.dto.req.ResetPasswordReq;
import com.leaf.auth.dto.req.VerifyOTPReq;
import com.leaf.auth.dto.res.AuthenticateRes;
import com.leaf.auth.dto.res.RefreshTokenRes;
import com.leaf.auth.dto.res.VerifyTokenRes;
import com.leaf.auth.service.AuthService;
import com.leaf.auth.service.UserService;
import com.leaf.common.dto.ResponseObject;
import com.leaf.framework.constant.CommonConstants;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
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
    public ResponseEntity<ResponseObject<AuthenticateRes>> authorize(
        @Valid @RequestBody LoginReq loginReq,
        HttpServletRequest httpServletRequest,
        HttpServletResponse httpServletResponse
    ) {
        AuthenticateRes authenticateRes = authService.authenticate(loginReq, httpServletRequest, httpServletResponse);
        return ResponseEntity.ok(ResponseObject.success(authenticateRes));
    }

    @PostMapping("/p/refresh-token")
    public ResponseEntity<ResponseObject<RefreshTokenRes>> refreshToken(
        @CookieValue(name = CommonConstants.COOKIE_NAME, required = false) String cookieValue,
        @Valid @RequestBody LogoutReq req,
        HttpServletRequest httpServletRequest,
        HttpServletResponse response
    ) {
        return ResponseEntity.ok(
            ResponseObject.success(
                authService.refreshToken(cookieValue, req.getChannel(), httpServletRequest, response)
            )
        );
    }

    @PostMapping("/internal/verify")
    public ResponseEntity<ResponseObject<VerifyTokenRes>> verifyToken(
        @CookieValue(name = CommonConstants.COOKIE_NAME) String cookieValue
    ) {
        return ResponseEntity.ok(ResponseObject.success(authService.verifyToken(cookieValue, false)));
    }

    @PostMapping("/c/create")
    public ResponseEntity<ResponseObject<UserDTO>> createUser(@Valid @RequestBody UserDTO userDTO) {
        UserDTO newUserDTO = userService.createUser(userDTO, false);
        return ResponseEntity.ok(ResponseObject.success(newUserDTO));
    }

    @PostMapping("/p/change-password")
    public ResponseEntity<ResponseObject<Boolean>> changePassword(
        @CookieValue(name = CommonConstants.COOKIE_NAME) String cookieValue,
        @Valid @RequestBody ChangePasswordReq req,
        HttpServletResponse response
    ) {
        userService.changePassword(cookieValue, req, response);
        return ResponseEntity.ok(ResponseObject.success());
    }

    @PostMapping("/p/reset-password")
    public ResponseEntity<ResponseObject<Boolean>> resetPassword(@Valid @RequestBody ResetPasswordReq req) {
        userService.resetPassword(req);
        return ResponseEntity.ok(ResponseObject.success());
    }

    @PostMapping("/p/forgot-password")
    public ResponseEntity<ResponseObject<Boolean>> forgotPassword(@Valid @RequestBody ForgotPasswordReq req) {
        userService.forgotPasswordRequest(req);
        return ResponseEntity.ok(ResponseObject.success());
    }

    @PostMapping("/p/verify-forgot-password-otp")
    public ResponseEntity<ResponseObject<Boolean>> verifyForgotPasswordOTP(@Valid @RequestBody VerifyOTPReq req) {
        userService.verifyForgotPasswordOTP(req);
        return ResponseEntity.ok(ResponseObject.success());
    }

    @PostMapping("/p/update")
    public ResponseEntity<ResponseObject<Boolean>> updateUserProfile(@RequestBody UserProfileDTO req) {
        userService.updateUserProfile(req);
        return ResponseEntity.ok(ResponseObject.success());
    }

    @PostMapping("/p/logout")
    public ResponseEntity<ResponseObject<?>> logout(
        @CookieValue(name = CommonConstants.COOKIE_NAME) String cookieValue,
        @RequestBody LogoutReq req,
        HttpServletResponse response
    ) {
        authService.logout(cookieValue, req.getChannel(), response);
        return ResponseEntity.ok(ResponseObject.success());
    }

    @PostMapping("/p/logout-all-devices")
    public ResponseEntity<ResponseObject<?>> logoutAllDevices(
        @CookieValue(name = CommonConstants.COOKIE_NAME) String cookieValue,
        HttpServletResponse response
    ) {
        authService.logoutAllDevices(cookieValue, response);
        return ResponseEntity.ok(ResponseObject.success());
    }
}
