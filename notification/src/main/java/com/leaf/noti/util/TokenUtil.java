package com.leaf.noti.util;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import com.leaf.common.dto.event.VerificationEmailEvent;
import com.leaf.common.grpc.VerifyEmailTokenDTO;
import com.leaf.noti.config.NotificationProperites;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TokenUtil {

    private final NotificationProperites notificationProperites;
    private static final String FULLNAME_KEY = "fullname";
    private static final String EMAIL_KEY = "email";

    private SecretKey getSigningKey() {
        byte[] keyBytes = notificationProperites.getSecretKey().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(VerificationEmailEvent request) {
        return Jwts.builder()
                .setId(UUID.randomUUID().toString())
                .setSubject(request.getUsername())
                .claim(FULLNAME_KEY, request.getFullname())
                .claim(EMAIL_KEY, request.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 5 * 60 * 1000)) // 5 phút
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public VerifyEmailTokenDTO parseToken(String token) {
        var body = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return VerifyEmailTokenDTO.newBuilder()
                .setUsername(body.getSubject())
                .setFullname(body.get(FULLNAME_KEY, String.class))
                .setEmail(body.get(EMAIL_KEY, String.class))
                .build();
    }
}
