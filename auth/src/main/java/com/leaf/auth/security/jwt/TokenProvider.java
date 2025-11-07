package com.leaf.auth.security.jwt;

import java.security.Key;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import com.leaf.auth.config.ApplicationProperties;
import com.leaf.auth.domain.User;
import com.leaf.auth.dto.NotificationPayload;
import com.leaf.auth.dto.res.RefreshTokenResponse;
import com.leaf.auth.enums.NotificationType;
import com.leaf.auth.exceptions.CustomAuthenticationException;
import com.leaf.auth.repository.UserRepository;
import com.leaf.auth.security.CustomUserDetails;
import com.leaf.auth.utils.CookieUtil;
import com.leaf.common.enums.AuthKey;
import com.leaf.common.exceptions.ApiException;
import com.leaf.common.exceptions.ErrorMessage;
import com.leaf.common.security.SecurityUtils;
import com.leaf.common.service.RedisService;
import com.leaf.common.utils.JsonF;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class TokenProvider {

    private static final String AUTHORITIES_KEY = "auth";
    private static final String ROLES_KEY = "role";
    private static final String USER_GLOBAL_KEY = "isGlobal";
    private static final String INVALID_JWT_TOKEN = "Invalid JWT token.";
    private final Key key;
    private final JwtParser jwtParser;
    private final SimpMessagingTemplate messagingTemplate;
    private final RedisService redisService;
    private final UserRepository userRepository;
    private final CookieUtil cookieUtil;
    private final Long tokenValidityDuration;
    private final Long refreshTokenValidityDuration;

    public TokenProvider(SimpMessagingTemplate messagingTemplate,
            RedisService redisService, UserRepository userRepository, CookieUtil cookieUtil,
            ApplicationProperties applicationProperties) {
        this.messagingTemplate = messagingTemplate;
        this.redisService = redisService;
        this.userRepository = userRepository;
        this.cookieUtil = cookieUtil;
        String secret = cookieUtil.getProperties().getSecurity().getBase64Secret();
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        key = Keys.hmacShaKeyFor(keyBytes);
        jwtParser = Jwts.parserBuilder().setSigningKey(key).build();
        this.tokenValidityDuration = cookieUtil.getProperties().getSecurity().getValidDurationInSeconds();
        this.refreshTokenValidityDuration = cookieUtil.getProperties().getSecurity().getRefreshDurationInSeconds();
    }

    public String createToken(Authentication authentication, HttpServletRequest request,
            HttpServletResponse response) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        String jwtName = authentication.getName();
        String tokenExisting = redisService.getToken(jwtName);
        HttpSession session = request.getSession(true);
        String sessionId = session.getId();

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
            this.revokeToken(tokenExisting);
        }

        String token = this.generateToken(authentication, this.tokenValidityDuration, request);
        String refreshToken = this.generateToken(authentication, this.refreshTokenValidityDuration, request);

        redisService.saveToken(jwtName, token, this.tokenValidityDuration);

        Cookie cookie = cookieUtil.setTokenCookie(token, refreshToken);
        response.addCookie(cookie);

        User user = userRepository.findByUsername(jwtName)
                .orElseThrow(() -> new ApiException(ErrorMessage.USER_NOT_FOUND));
        user.setRefreshToken(refreshToken);
        userRepository.save(user);
        response.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token);
        return token;
    }

    public RefreshTokenResponse refreshToken(Authentication authentication,
            String cookieValue,
            HttpServletRequest request,
            HttpServletResponse response) {
        Map<String, String> tokenData = JsonF.jsonToObject(cookieValue, Map.class);

        String refreshToken = tokenData.get(AuthKey.REFRESH_TOKEN.getKey());
        if (StringUtils.isBlank(refreshToken)) {
            throw new ApiException(ErrorMessage.REFRESH_TOKEN_INVALID);
        }

        Claims claims = jwtParser.parseClaimsJws(refreshToken).getBody();
        String username = claims.getSubject();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException(ErrorMessage.USER_NOT_FOUND));

        if (!Objects.equals(user.getRefreshToken(), refreshToken) || StringUtils.isBlank(user.getRefreshToken())) {
            throw new ApiException(ErrorMessage.REFRESH_TOKEN_INVALID);
        }

        String newToken = this.generateToken(authentication, this.tokenValidityDuration, request);
        String newRefreshToken = this.generateToken(authentication, this.refreshTokenValidityDuration,
                request);

        redisService.saveToken(username, newToken, this.tokenValidityDuration);

        // save new refresh token
        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);

        Cookie cookie = cookieUtil.setTokenCookie(newToken, newRefreshToken);
        response.addCookie(cookie);

        return RefreshTokenResponse.builder()
                .accessToken(newToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = jwtParser.parseClaimsJws(token).getBody();
        Collection<? extends GrantedAuthority> authorities = Arrays
                .stream(claims.get(AUTHORITIES_KEY).toString().split(","))
                .filter(auth -> !auth.trim().isEmpty())
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        CustomUserDetails principal = new CustomUserDetails(
                claims.getSubject(),
                "",
                authorities,
                claims.get(ROLES_KEY, String.class),
                claims.get(USER_GLOBAL_KEY, Boolean.class));
        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }

    public boolean validateToken(String authToken) {
        try {
            Claims claims = jwtParser.parseClaimsJws(authToken).getBody();
            String username = claims.getSubject(); // lấy JWT ID

            Date expiration = claims.getExpiration();

            if (expiration.before(new Date())) {
                throw new ApiException(ErrorMessage.UNAUTHENTICATED);
            }

            return redisService.isTokenValid(username, authToken);
        } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException | SignatureException e) {
            log.trace(INVALID_JWT_TOKEN, e);
        } catch (IllegalArgumentException e) {
            log.error("Token validation error {}", e.getMessage());
        }
        return false;
    }

    public void revokeToken(String token) {
        Claims claims = jwtParser.parseClaimsJws(token).getBody();
        String username = SecurityUtils.getCurrentUserLogin().orElseThrow(
                () -> new CustomAuthenticationException("User not authenticated", HttpStatus.UNAUTHORIZED));
        if (Objects.equals(claims.getSubject(), username)) {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ApiException(ErrorMessage.USER_NOT_FOUND));
            user.setRefreshToken(null);
            userRepository.save(user);
            redisService.deleteToken(claims.getSubject());
        }
    }

    private String generateToken(Authentication authentication, long validityTimeInSeconds,
            HttpServletRequest request) {
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        long now = System.currentTimeMillis();
        long validityMillis = validityTimeInSeconds * 1000L;
        Date validity = new Date(now + validityMillis);

        HttpSession session = request.getSession(true);
        String sessionId = session.getId();

        return Jwts.builder()
                .setId(sessionId)
                .setSubject(authentication.getName())
                .claim(AUTHORITIES_KEY, authorities)
                .claim(ROLES_KEY, String.join(",", userDetails.getRole()))
                .claim(USER_GLOBAL_KEY, userDetails.isGlobal())
                .setIssuedAt(new Date(now))
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }
}
