package com.leaf.auth.security.jwt;

import com.leaf.auth.domain.Role;
import com.leaf.auth.domain.User;
import com.leaf.auth.dto.NotificationPayload;
import com.leaf.auth.dto.res.RefreshTokenResponse;
import com.leaf.auth.enums.NotificationType;
import com.leaf.auth.exception.CustomAuthenticationException;
import com.leaf.auth.repository.UserRepository;
import com.leaf.auth.security.CustomUserDetails;
import com.leaf.auth.util.CookieUtil;
import com.leaf.common.dto.UserSessionDTO;
import com.leaf.common.enums.AuthKey;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.utils.AESUtils;
import com.leaf.common.utils.CommonUtils;
import com.leaf.common.utils.JsonF;
import com.leaf.framework.config.ApplicationProperties;
import com.leaf.framework.security.SecurityUtils;
import com.leaf.framework.service.RedisService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.crypto.SecretKey;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class TokenProvider {

    private static final String CHANNEL_KEY = "channel";
    private static final String AUTHORITIES_KEY = "auth";
    private static final String ROLES_KEY = "role";
    private static final String USER_GLOBAL_KEY = "isGlobal";
    private static final String INVALID_JWT_TOKEN = "Invalid JWT token.";
    private final SecretKey key;
    private final JwtParser jwtParser;
    private final SimpMessagingTemplate messagingTemplate;
    private final RedisService redisService;
    private final UserRepository userRepository;
    private final CookieUtil cookieUtil;
    private final Long tokenValidityDuration;
    private final Long refreshTokenValidityDuration;

    public TokenProvider(
        SimpMessagingTemplate messagingTemplate,
        RedisService redisService,
        UserRepository userRepository,
        CookieUtil cookieUtil,
        ApplicationProperties applicationProperties
    ) {
        this.messagingTemplate = messagingTemplate;
        this.redisService = redisService;
        this.userRepository = userRepository;
        this.cookieUtil = cookieUtil;
        String secret = applicationProperties.getSecurity().getBase64Secret();
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        key = Keys.hmacShaKeyFor(keyBytes);
        jwtParser = Jwts.parser().verifyWith(key).build();
        this.tokenValidityDuration = applicationProperties.getSecurity().getValidDurationInSeconds();
        this.refreshTokenValidityDuration = applicationProperties.getSecurity().getRefreshDurationInSeconds();
    }

    public String createToken(
        Authentication authentication,
        HttpServletRequest request,
        HttpServletResponse response,
        String channel
    ) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        String name = authentication.getName();
        String keyToken = redisService.getKeyToken(name, channel);
        String tokenExisting = redisService.get(keyToken, String.class);
        String sessionId = UUID.randomUUID().toString();

        // chưa làm
        if (tokenExisting != null) {
            NotificationPayload<?> payload = NotificationPayload.builder()
                .type(NotificationType.FORCE_LOGOUT)
                .message("Tài khoản của bạn vừa đăng nhập ở nơi khác")
                .title("Phiên đăng nhập")
                .sessionId(sessionId)
                .timestamp(Instant.now())
                .username(userDetails.getUsername())
                .build();
            messagingTemplate.convertAndSendToUser(userDetails.getUsername(), "/queue/force-logout", payload);

            // Revoke old session: delete tokens and clear refresh token
            // Note: tokenExisting is a hash, not the actual JWT, so we can't parse it
            User user = userRepository
                .findByUsername(name)
                .orElseThrow(() -> new ApiException(ErrorMessage.USER_NOT_FOUND));
            user.setRefreshToken(null);
            userRepository.save(user);
            redisService.evict(keyToken);
        }

        String token = this.generateToken(authentication, this.tokenValidityDuration, channel, sessionId);
        String refreshToken = this.generateToken(authentication, this.refreshTokenValidityDuration, channel, sessionId);
        this.cacheUserToken(name, channel, sessionId, token);

        Cookie cookie = cookieUtil.setTokenCookie(token, refreshToken);
        response.addCookie(cookie);

        User user = userRepository
            .findByUsername(name)
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_NOT_FOUND));
        user.setRefreshToken(refreshToken);
        userRepository.save(user);
        response.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token);
        return token;
    }

    public RefreshTokenResponse refreshToken(
        String cookieValue,
        HttpServletRequest request,
        HttpServletResponse response,
        String channel
    ) {
        @SuppressWarnings("unchecked")
        Map<String, String> tokenData = JsonF.jsonToObject(cookieValue, Map.class);
        String refreshToken = "";

        if (Objects.nonNull(tokenData)) {
            refreshToken = tokenData.get(AuthKey.REFRESH_TOKEN.getKey());
        }

        if (StringUtils.isBlank(refreshToken)) {
            String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
            if (StringUtils.isNotBlank(authHeader) && authHeader.startsWith("Bearer ")) {
                refreshToken = authHeader.substring(7);
            }
        }

        if (StringUtils.isBlank(refreshToken)) {
            throw new ApiException(ErrorMessage.REFRESH_TOKEN_INVALID);
        }

        Claims claims = jwtParser.parseSignedClaims(refreshToken).getPayload();
        String username = claims.getSubject();
        User user = userRepository
            .findByUsername(username)
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_NOT_FOUND));

        if (!Objects.equals(user.getRefreshToken(), refreshToken) || StringUtils.isBlank(user.getRefreshToken())) {
            throw new ApiException(ErrorMessage.REFRESH_TOKEN_INVALID);
        }

        Collection<? extends GrantedAuthority> authorities = user
            .getRoles()
            .stream()
            .map(role -> new SimpleGrantedAuthority(role.getName()))
            .collect(Collectors.toList());

        String rolesStr = user.getRoles().stream().map(Role::getName).collect(Collectors.joining(","));

        CustomUserDetails userDetails = new CustomUserDetails(
            user.getUsername(),
            user.getPassword(),
            authorities,
            rolesStr,
            user.getIsGlobal(),
            channel
        );

        Authentication newAuthentication = new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
        String sessionId = UUID.randomUUID().toString();
        String newToken = this.generateToken(newAuthentication, this.tokenValidityDuration, channel, sessionId);
        String newRefreshToken = this.generateToken(
            newAuthentication,
            this.refreshTokenValidityDuration,
            channel,
            sessionId
        );
        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);
        this.cacheUserToken(username, channel, sessionId, newToken);

        Cookie cookie = cookieUtil.setTokenCookie(newToken, newRefreshToken);
        response.addCookie(cookie);

        return RefreshTokenResponse.builder().accessToken(newToken).refreshToken(newRefreshToken).build();
    }

    public RefreshTokenResponse processRefreshInternal(String refreshToken, String channel) {
        if (CommonUtils.isEmpty(refreshToken)) {
            throw new ApiException(ErrorMessage.REFRESH_TOKEN_INVALID);
        }
        if (CommonUtils.isEmpty(channel)) {
            throw new ApiException(ErrorMessage.CHANNEL_INVALID);
        }

        try {
            Claims claims = jwtParser.parseSignedClaims(refreshToken).getPayload();
            String username = claims.getSubject();
            String id = claims.getId();
            User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new ApiException(ErrorMessage.USER_NOT_FOUND));

            if (!Objects.equals(user.getRefreshToken(), refreshToken) || StringUtils.isBlank(user.getRefreshToken())) {
                throw new ApiException(ErrorMessage.REFRESH_TOKEN_INVALID);
            }

            Collection<? extends GrantedAuthority> authorities = user
                .getRoles()
                .stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());

            String rolesStr = user.getRoles().stream().map(Role::getName).collect(Collectors.joining(","));

            CustomUserDetails userDetails = new CustomUserDetails(
                user.getUsername(),
                user.getPassword(),
                authorities,
                rolesStr,
                user.getIsGlobal(),
                channel
            );

            Authentication newAuthentication = new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
            String newToken = this.generateToken(newAuthentication, this.tokenValidityDuration, channel, id);
            String newRefreshToken = this.generateToken(
                newAuthentication,
                this.refreshTokenValidityDuration,
                channel,
                id
            );
            user.setRefreshToken(newRefreshToken);
            userRepository.save(user);
            this.cacheUserToken(username, channel, id, newToken);

            log.info("Auth Log:: Refresh Token Processed");
            return RefreshTokenResponse.builder().accessToken(newToken).refreshToken(newRefreshToken).build();
        } catch (Exception e) {
            throw new ApiException(ErrorMessage.REFRESH_TOKEN_INVALID);
        }
    }

    public Authentication getAuthentication(String token) {
        Claims claims = jwtParser.parseSignedClaims(token).getPayload();
        Collection<? extends GrantedAuthority> authorities = Arrays.stream(
            claims.get(AUTHORITIES_KEY).toString().split(",")
        )
            .filter(auth -> !auth.trim().isEmpty())
            .map(SimpleGrantedAuthority::new)
            .collect(Collectors.toList());
        CustomUserDetails principal = new CustomUserDetails(
            claims.getSubject(),
            "",
            authorities,
            claims.get(ROLES_KEY, String.class),
            claims.get(USER_GLOBAL_KEY, Boolean.class),
            claims.get(CHANNEL_KEY, String.class)
        );
        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }

    public boolean validateToken(String authToken) {
        try {
            Claims claims = jwtParser.parseSignedClaims(authToken).getPayload();
            String username = claims.getSubject();
            String channel = claims.get(CHANNEL_KEY, String.class);

            Date expiration = claims.getExpiration();

            if (expiration.before(new Date())) {
                throw new ApiException(ErrorMessage.UNAUTHENTICATED);
            }

            String keyToken = redisService.getKeyToken(username, channel);
            String tokenExisting = redisService.get(keyToken, String.class);
            return Objects.equals(tokenExisting, AESUtils.hexString(authToken));
        } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException | SecurityException e) {
            log.trace(INVALID_JWT_TOKEN, e);
        } catch (IllegalArgumentException e) {
            log.error("Token validation error {}", e.getMessage());
        }
        return false;
    }

    public void revokeToken(String token, String channel) {
        String username = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new CustomAuthenticationException("User not authenticated", HttpStatus.UNAUTHORIZED)
        );
        if (StringUtils.isNotBlank(username)) {
            User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new ApiException(ErrorMessage.USER_NOT_FOUND));
            user.setRefreshToken(null);
            userRepository.save(user);
            String keyToken = redisService.getKeyToken(username, channel);
            redisService.evict(keyToken);
            String keyUser = redisService.getKeyUser(username, channel);
            redisService.evict(keyUser);
        }
    }

    private String generateToken(
        Authentication authentication,
        long validityTimeInSeconds,
        String channel,
        String sessionId
    ) {
        String authorities = authentication
            .getAuthorities()
            .stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.joining(","));
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        long now = System.currentTimeMillis();
        long validityMillis = validityTimeInSeconds * 1000L;
        Date validity = new Date(now + validityMillis);

        return Jwts.builder()
            .id(sessionId)
            .subject(authentication.getName())
            .claim(AUTHORITIES_KEY, authorities)
            .claim(ROLES_KEY, String.join(",", userDetails.getRole()))
            .claim(USER_GLOBAL_KEY, userDetails.isGlobal())
            .claim(CHANNEL_KEY, channel)
            .issuedAt(new Date(now))
            .expiration(validity)
            .signWith(key, Jwts.SIG.HS512)
            .compact();
    }

    private void cacheUserToken(String username, String channel, String sessionId, String token) {
        String keyUser = redisService.getKeyUser(username, channel);
        UserSessionDTO userSessionDTO = UserSessionDTO.builder()
            .sessionId(sessionId)
            .channel(channel)
            .secretKey(AESUtils.generateSecretKey())
            .build();
        redisService.set(keyUser, userSessionDTO);

        String keyToken = redisService.getKeyToken(username, channel);
        redisService.set(keyToken, AESUtils.hexString(token));
    }
}
