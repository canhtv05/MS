package com.canhtv05.auth.service;

import com.canhtv05.auth.domain.Permission;
import com.canhtv05.auth.domain.User;
import com.canhtv05.auth.domain.UserPermission;
import com.canhtv05.auth.dto.UserProfileDTO;
import com.canhtv05.auth.dto.req.LoginRequest;
import com.canhtv05.auth.dto.res.RefreshTokenResponse;
import com.canhtv05.auth.dto.res.VerifyTokenResponse;
import com.canhtv05.common.enums.AuthKey;
import com.canhtv05.auth.enums.PermissionAction;
import com.canhtv05.auth.exceptions.CustomAuthenticationException;
import com.canhtv05.auth.repository.UserPermissionRepository;
import com.canhtv05.auth.repository.UserRepository;
import com.canhtv05.auth.security.jwt.TokenProvider;
import com.canhtv05.auth.util.CookieUtil;
import com.canhtv05.common.exceptions.ApiException;
import com.canhtv05.common.exceptions.ErrorMessage;
import com.canhtv05.common.security.SecurityUtils;
import com.canhtv05.common.utils.JsonF;

import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.springframework.boot.json.JsonParseException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthService {

    CookieUtil cookieUtil;
    UserRepository userRepository;
    UserPermissionRepository userPermissionRepository;
    // dùng AuthenticationManagerBuilder tránh vòng lặp phụ thuộc
    AuthenticationManagerBuilder authenticationManagerBuilder;
    TokenProvider tokenProvider;

    @Transactional
    public String authenticate(LoginRequest loginRequest, HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),
                loginRequest.getPassword());

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return tokenProvider.createToken(authentication, httpServletRequest, httpServletResponse);
    }

    @Transactional
    public RefreshTokenResponse refreshToken(String cookieValue, HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return tokenProvider.refreshToken(authentication, cookieValue, httpServletRequest, httpServletResponse);
    }

    @Transactional(readOnly = true)
    public VerifyTokenResponse verifyToken(String cookieValueOrTokenString) {
        String accessToken = getAccessToken(cookieValueOrTokenString);
        if (StringUtils.isBlank(accessToken)) {
            throw new ApiException(ErrorMessage.ACCESS_TOKEN_INVALID);
        }

        boolean valid = this.tokenProvider.validateToken(accessToken);

        return VerifyTokenResponse.builder()
                .valid(valid)
                .build();
    }

    @Transactional
    public void logout(String cookieValue, HttpServletResponse response) {
        String accessToken = getAccessToken(cookieValue);
        tokenProvider.revokeToken(accessToken);
        cookieUtil.deleteCookie(response);
        SecurityUtils.clear();
    }

    @Transactional(readOnly = true)
    public Optional<User> findOneWithAuthoritiesByUsername(String username) {
        return userRepository.findOneWithAuthoritiesByUsername(username);
    }

    @Transactional(readOnly = true)
    public UserProfileDTO getProfile() {
        String username = SecurityUtils.getCurrentUserLogin().orElseThrow(
                () -> new CustomAuthenticationException("User not authenticated", HttpStatus.UNAUTHORIZED));
        Optional<User> user = userRepository.findOneWithAuthoritiesByUsername(username);
        if (user.isEmpty()) {
            throw new ApiException(ErrorMessage.USER_NOT_FOUND);
        }
        UserProfileDTO userProfileDTO = UserProfileDTO.fromEntity(user.get());
        this.mappingUserPermissions(userProfileDTO, user.get());
        return userProfileDTO;
    }

    @Transactional(readOnly = true)
    public void mappingUserPermissions(UserProfileDTO userProfileDTO, User user) {
        Set<String> permissions = user.getRoles().stream()
                .filter(role -> !ObjectUtils.isEmpty(role.getPermissions()))
                .flatMap(role -> role.getPermissions().stream())
                .filter(Objects::nonNull)
                .map(Permission::getCode)
                .collect(Collectors.toSet());
        List<UserPermission> userPermissions = userPermissionRepository.findAllByUserId(user.getId());
        if (!userPermissions.isEmpty()) {
            permissions.addAll(userPermissions.stream()
                    .filter(pm -> PermissionAction.GRANT.equals(pm.getAction()))
                    .map(UserPermission::getPermissionCode)
                    .collect(Collectors.toSet()));
            permissions.removeAll(userPermissions.stream()
                    .filter(pm -> PermissionAction.DENY.equals(pm.getAction()))
                    .map(UserPermission::getPermissionCode)
                    .collect(Collectors.toSet()));
        }
        userProfileDTO.setPermissions(new ArrayList<>(permissions));
    }

    @Transactional(readOnly = true)
    protected String getAccessToken(String cookieValueOrTokenString) {
        try {
            Map<String, String> tokenData = JsonF.jsonToObject(cookieValueOrTokenString, Map.class);
            if (CollectionUtils.isEmpty(tokenData)) {
                return cookieValueOrTokenString;
            }
            String accessToken = tokenData.get(AuthKey.ACCESS_TOKEN.getKey());
            if (StringUtils.isBlank(accessToken)) {
                throw new ApiException(ErrorMessage.ACCESS_TOKEN_INVALID);
            }
            return accessToken;
        } catch (JsonParseException e) {
            return cookieValueOrTokenString;
        }
    }
}
