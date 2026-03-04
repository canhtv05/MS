package com.leaf.auth.service;

import com.leaf.auth.context.AuthenticationContext;
import com.leaf.auth.domain.Permission;
import com.leaf.auth.domain.User;
import com.leaf.auth.domain.UserPermission;
import com.leaf.auth.dto.UserProfileDTO;
import com.leaf.auth.dto.req.LoginReq;
import com.leaf.auth.dto.res.AuthenticateRes;
import com.leaf.auth.dto.res.RefreshTokenRes;
import com.leaf.auth.dto.res.VerifyTokenRes;
import com.leaf.auth.enums.PermissionAction;
import com.leaf.auth.repository.UserPermissionRepository;
import com.leaf.auth.repository.UserRepository;
import com.leaf.auth.security.jwt.TokenProvider;
import com.leaf.auth.util.CookieUtil;
import com.leaf.common.dto.TokenPairDTO;
import com.leaf.common.enums.AuthKey;
import com.leaf.common.enums.TokenStatus;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.framework.blocking.security.SecurityUtils;
import com.leaf.framework.blocking.util.CommonUtil;
import com.leaf.framework.blocking.util.JsonF;
import com.leaf.framework.blocking.util.JwtUtil;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.json.JsonParseException;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
public class AuthService {

    private final CookieUtil cookieUtil;
    private final UserRepository userRepository;
    private final UserPermissionRepository userPermissionRepository;
    // dùng AuthenticationManagerBuilder tránh vòng lặp phụ thuộc
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final TokenProvider tokenProvider;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthenticateRes authenticate(
        LoginReq loginReq,
        HttpServletRequest httpServletRequest,
        HttpServletResponse httpServletResponse
    ) {
        try {
            AuthenticationContext.setChannel(loginReq.getChannel());

            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginReq.getUsername(),
                loginReq.getPassword()
            );

            Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = tokenProvider.createToken(
                authentication,
                httpServletRequest,
                httpServletResponse,
                loginReq.getChannel()
            );
            if (StringUtils.isBlank(token)) {
                throw new ApiException(ErrorMessage.ACCESS_TOKEN_INVALID);
            }
            return new AuthenticateRes(true);
        } finally {
            AuthenticationContext.clear();
        }
    }

    @Transactional
    public RefreshTokenRes refreshToken(
        String cookieValue,
        String channel,
        HttpServletRequest httpServletRequest,
        HttpServletResponse httpServletResponse
    ) {
        return tokenProvider.refreshToken(cookieValue, httpServletRequest, httpServletResponse, channel);
    }

    @Transactional(readOnly = true)
    public VerifyTokenRes verifyToken(String cookieValueOrTokenString, boolean isInternal) {
        TokenPairDTO tokenPair = getTokenPair(cookieValueOrTokenString, isInternal);
        if (StringUtils.isBlank(tokenPair.getAccessToken())) {
            throw new ApiException(ErrorMessage.ACCESS_TOKEN_INVALID);
        }

        TokenStatus valid = jwtUtil.validateToken(tokenPair.getAccessToken());
        if (TokenStatus.VALID.equals(valid)) {
            return VerifyTokenRes.builder()
                .valid(TokenStatus.VALID.equals(valid))
                .accessToken(tokenPair.getAccessToken())
                .refreshToken(tokenPair.getRefreshToken())
                .build();
        }

        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest httpServletRequest = attributes.getRequest();
        HttpServletResponse httpServletResponse = attributes.getResponse();
        Optional<TokenPairDTO> cookieTokenPair = CommonUtil.tokenFromCookie(
            httpServletRequest.getHeader(HttpHeaders.COOKIE)
        );
        if (cookieTokenPair.isEmpty() || StringUtils.isBlank(cookieTokenPair.get().getAccessToken())) {
            throw new ApiException(ErrorMessage.TOKEN_PAIR_INVALID);
        }
        RefreshTokenRes refreshTokenRes = refreshToken(
            tokenPair.getRefreshToken(),
            tokenPair.getAccessToken(),
            httpServletRequest,
            httpServletResponse
        );
        if (Objects.isNull(refreshTokenRes)) {
            throw new ApiException(ErrorMessage.TOKEN_PAIR_INVALID);
        } else {
            valid = TokenStatus.VALID;
        }
        return VerifyTokenRes.builder()
            .valid(TokenStatus.VALID.equals(valid))
            .accessToken(refreshTokenRes.getAccessToken())
            .refreshToken(refreshTokenRes.getRefreshToken())
            .build();
    }

    @Transactional(readOnly = true)
    public VerifyTokenRes verifyTokenInternal(String accessToken, String refreshToken, String channel) {
        TokenStatus valid = jwtUtil.validateToken(accessToken);
        if (TokenStatus.VALID.equals(valid)) {
            return VerifyTokenRes.builder()
                .valid(TokenStatus.VALID.equals(valid))
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
        }

        if (StringUtils.isBlank(refreshToken)) {
            throw new ApiException(ErrorMessage.REFRESH_TOKEN_INVALID);
        }
        RefreshTokenRes refreshTokenRes = tokenProvider.processRefreshInternal(refreshToken, channel);
        if (Objects.isNull(refreshTokenRes)) {
            throw new ApiException(ErrorMessage.TOKEN_PAIR_INVALID);
        } else {
            valid = TokenStatus.VALID;
        }
        return VerifyTokenRes.builder()
            .valid(TokenStatus.VALID.equals(valid))
            .accessToken(refreshTokenRes.getAccessToken())
            .refreshToken(refreshTokenRes.getRefreshToken())
            .build();
    }

    @Transactional
    public void logout(String cookieValue, String channel, HttpServletResponse response) {
        TokenPairDTO tokenPair = getTokenPair(cookieValue, false);
        tokenProvider.revokeToken(tokenPair.getAccessToken(), channel);
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
        UserProfileDTO userProfileDTO = UserProfileDTO.toDTO(user.get());
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
    private TokenPairDTO getTokenPair(String cookieValueOrTokenString, boolean isInternal) {
        if (StringUtils.isBlank(cookieValueOrTokenString) || isInternal) {
            return TokenPairDTO.builder().accessToken(cookieValueOrTokenString).build();
        }
        try {
            @SuppressWarnings("unchecked")
            Map<String, String> tokenData = JsonF.jsonToObject(cookieValueOrTokenString, Map.class);
            if (CollectionUtils.isEmpty(tokenData)) {
                return TokenPairDTO.builder().accessToken(cookieValueOrTokenString).build();
            }
            String accessToken = tokenData.get(AuthKey.ACCESS_TOKEN.getKey());
            String refreshToken = tokenData.get(AuthKey.REFRESH_TOKEN.getKey());
            if (CommonUtil.isEmpty(accessToken, refreshToken)) {
                throw new ApiException(ErrorMessage.TOKEN_PAIR_INVALID);
            }
            return TokenPairDTO.builder().accessToken(accessToken).refreshToken(refreshToken).build();
        } catch (JsonParseException e) {
            return TokenPairDTO.builder().accessToken(cookieValueOrTokenString).build();
        }
    }

    @Transactional
    public void logoutAllDevices(String cookieValue, HttpServletResponse response) {
        TokenPairDTO tokenPair = getTokenPair(cookieValue, false);
        tokenProvider.revokeAllTokens(tokenPair.getAccessToken());
        cookieUtil.deleteCookie(response);
        SecurityUtils.clear();
    }
}
