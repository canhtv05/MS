package com.canhtv05.auth.service;

import com.canhtv05.auth.domain.Permission;
import com.canhtv05.auth.domain.User;
import com.canhtv05.auth.domain.UserPermission;
import com.canhtv05.auth.dto.LoginRequest;
import com.canhtv05.auth.dto.UserProfileDTO;
import com.canhtv05.auth.enums.PermissionAction;
import com.canhtv05.auth.exceptions.CustomAuthenticationException;
import com.canhtv05.auth.repository.UserPermissionRepository;
import com.canhtv05.auth.repository.UserRepository;
import com.canhtv05.auth.security.jwt.TokenProvider;

import com.canhtv05.common.exceptions.ApiException;
import com.canhtv05.common.exceptions.ErrorMessage;
import com.canhtv05.common.security.SecurityUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthService {

    UserRepository userRepository;
    UserPermissionRepository userPermissionRepository;
    // dùng AuthenticationManagerBuilder tránh vòng lặp phụ thuộc
    AuthenticationManagerBuilder authenticationManagerBuilder;
    TokenProvider tokenProvider;

    public String authenticate(LoginRequest loginRequest, HttpServletRequest httpServletRequest) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),
                loginRequest.getPassword());

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return tokenProvider.createToken(authentication, loginRequest.isRememberMe(), httpServletRequest);
    }

    public void logout(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            tokenProvider.revokeToken(token);
        }
    }

    public Optional<User> findOneWithAuthoritiesByUsername(String username) {
        return userRepository.findOneWithAuthoritiesByUsername(username);
    }

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
}
