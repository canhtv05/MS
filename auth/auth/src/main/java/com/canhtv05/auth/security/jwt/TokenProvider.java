package com.canhtv05.auth.security.jwt;

import com.canhtv05.auth.config.ApplicationProperties;
import com.canhtv05.auth.dto.NotificationPayload;
import com.canhtv05.auth.enums.NotificationType;
import com.canhtv05.auth.security.CustomUserDetails;
import com.canhtv05.auth.service.RedisTokenService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

@Component
@Slf4j
public class TokenProvider {

    private static final String AUTHORITIES_KEY = "auth";
    private static final String ROLES_KEY = "role";
    private static final String USER_GLOBAL_KEY = "isGlobal";
    private static final String INVALID_JWT_TOKEN = "Invalid JWT token.";
    private final Key key;
    private final JwtParser jwtParser;
    private final long tokenValidityInMilliseconds;
    private final long tokenValidityInMillisecondsForRememberMe;
    private final SimpMessagingTemplate messagingTemplate;
    private final RedisTokenService redisTokenService;

    public TokenProvider(ApplicationProperties properties, SimpMessagingTemplate messagingTemplate,
            RedisTokenService redisTokenService) {
        this.messagingTemplate = messagingTemplate;
        this.redisTokenService = redisTokenService;
        String secret = properties.getSecurity().getBase64Secret();
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        key = Keys.hmacShaKeyFor(keyBytes);
        jwtParser = Jwts.parserBuilder().setSigningKey(key).build();
        this.tokenValidityInMilliseconds = 1000 * properties.getSecurity().getTokenValidityInSeconds();
        this.tokenValidityInMillisecondsForRememberMe = 1000 * properties.getSecurity().getTokenValidityInSeconds();
    }

    public String createToken(Authentication authentication, boolean rememberMe, HttpServletRequest request) {
        String authorities = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        long now = (new Date()).getTime();
        Date validity;
        if (rememberMe) {
            validity = new Date(now + this.tokenValidityInMillisecondsForRememberMe);
        } else {
            validity = new Date(now + this.tokenValidityInMilliseconds);
        }

        String jwtName = authentication.getName();
        String tokenExisting = redisTokenService.getToken(jwtName);
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

        String token = Jwts.builder()
                .setId(sessionId)
                .setSubject(authentication.getName())
                .claim(AUTHORITIES_KEY, authorities)
                .claim(ROLES_KEY, String.join(",", userDetails.getRole()))
                .claim(USER_GLOBAL_KEY, userDetails.isGlobal())
                .signWith(key, SignatureAlgorithm.HS512)
                .setExpiration(validity)
                .compact();

        redisTokenService.saveToken(jwtName, token, tokenValidityInMilliseconds / (1000 * 60));
        return token;
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

            return redisTokenService.isTokenValid(username, authToken);
        } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException | SignatureException e) {
            log.trace(INVALID_JWT_TOKEN, e);
        } catch (IllegalArgumentException e) {
            log.error("Token validation error {}", e.getMessage());
        }
        return false;
    }

    public void revokeToken(String token) {
        Claims claims = jwtParser.parseClaimsJws(token).getBody();
        redisTokenService.deleteToken(claims.getId());
    }
}
