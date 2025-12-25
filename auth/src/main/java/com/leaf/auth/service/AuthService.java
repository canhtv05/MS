package com.leaf.auth.service;

import com.leaf.auth.context.AuthenticationContext;
import com.leaf.auth.domain.Permission;
import com.leaf.auth.domain.User;
import com.leaf.auth.domain.UserPermission;
import com.leaf.auth.dto.UserProfileDTO;
import com.leaf.auth.dto.req.LoginRequest;
import com.leaf.auth.dto.res.RefreshTokenResponse;
import com.leaf.auth.dto.res.VerifyTokenResponse;
import com.leaf.auth.enums.PermissionAction;
import com.leaf.auth.repository.UserPermissionRepository;
import com.leaf.auth.repository.UserRepository;
import com.leaf.auth.security.jwt.TokenProvider;
import com.leaf.auth.util.CookieUtil;
import com.leaf.common.enums.AuthKey;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.utils.JsonF;
import com.leaf.framework.security.SecurityUtils;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.*;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.json.JsonParseException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

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
    public String authenticate(
        LoginRequest loginRequest,
        HttpServletRequest httpServletRequest,
        HttpServletResponse httpServletResponse
    ) {
        try {
            AuthenticationContext.setChannel(loginRequest.getChannel());

            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),
                loginRequest.getPassword()
            );

            Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            return tokenProvider.createToken(
                authentication,
                httpServletRequest,
                httpServletResponse,
                loginRequest.getChannel()
            );
        } finally {
            AuthenticationContext.clear();
        }
    }

    @Transactional
    public RefreshTokenResponse refreshToken(
        String cookieValue,
        String channel,
        HttpServletRequest httpServletRequest,
        HttpServletResponse httpServletResponse
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return tokenProvider.refreshToken(
            authentication,
            cookieValue,
            httpServletRequest,
            httpServletResponse,
            channel
        );
    }

    @Transactional(readOnly = true)
    public VerifyTokenResponse verifyToken(String cookieValueOrTokenString, boolean isInternal) {
        String accessToken = getAccessToken(cookieValueOrTokenString, isInternal);
        if (StringUtils.isBlank(accessToken)) {
            throw new ApiException(ErrorMessage.ACCESS_TOKEN_INVALID);
        }

        boolean valid = this.tokenProvider.validateToken(accessToken);

        return VerifyTokenResponse.builder().valid(valid).build();
    }

    @Transactional
    public void logout(String cookieValue, String channel, HttpServletResponse response) {
        String accessToken = getAccessToken(cookieValue, false);
        tokenProvider.revokeToken(accessToken, channel);
        cookieUtil.deleteCookie(response);
        SecurityUtils.clear();
    }

    @Transactional(readOnly = true)
    public Optional<User> findOneWithAuthoritiesByUsername(String username) {
        return userRepository.findOneWithAuthoritiesByUsername(username);
    }

    @Transactional(readOnly = true)
    public UserProfileDTO getProfile(String username) {
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
        Set<String> permissions = user
            .getRoles()
            .stream()
            .filter(role -> !ObjectUtils.isEmpty(role.getPermissions()))
            .flatMap(role -> role.getPermissions().stream())
            .filter(Objects::nonNull)
            .map(Permission::getCode)
            .collect(Collectors.toSet());
        List<UserPermission> userPermissions = userPermissionRepository.findAllByUserId(user.getId());
        if (!userPermissions.isEmpty()) {
            permissions.addAll(
                userPermissions
                    .stream()
                    .filter(pm -> PermissionAction.GRANT.equals(pm.getAction()))
                    .map(UserPermission::getPermissionCode)
                    .collect(Collectors.toSet())
            );
            permissions.removeAll(
                userPermissions
                    .stream()
                    .filter(pm -> PermissionAction.DENY.equals(pm.getAction()))
                    .map(UserPermission::getPermissionCode)
                    .collect(Collectors.toSet())
            );
        }
        userProfileDTO.setPermissions(new ArrayList<>(permissions));
    }

    @Transactional(readOnly = true)
    protected String getAccessToken(String cookieValueOrTokenString, boolean isInternal) {
        if (isInternal) {
            return cookieValueOrTokenString;
        }
        try {
            @SuppressWarnings("unchecked")
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
