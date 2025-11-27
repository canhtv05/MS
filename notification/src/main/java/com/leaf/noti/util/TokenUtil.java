package com.leaf.noti.util;

import java.util.Date;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import com.google.protobuf.Timestamp;
import com.leaf.common.dto.event.VerificationEmailEvent;
import com.leaf.common.grpc.VerifyEmailTokenDTO;
import com.leaf.noti.config.NotificationProperties;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TokenUtil {

    private final NotificationProperties notificationProperties;
    private static final String EMAIL_KEY = "email";

    public SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(notificationProperties.getSecretKey());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(VerificationEmailEvent request, Date expiredAt) {
        return Jwts.builder()
                .setId(UUID.randomUUID().toString())
                .setSubject(request.getUsername())
                .claim(EMAIL_KEY, request.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(expiredAt)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public VerifyEmailTokenDTO parseToken(String token) {
        var body = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        Date exp = body.getExpiration();

        Timestamp expiredAt = Timestamp.newBuilder()
                .setSeconds(exp.getTime() / 1000)
                .setNanos(0)
                .build();

        return VerifyEmailTokenDTO.newBuilder()
                .setUsername(body.getSubject())
                .setEmail(body.get(EMAIL_KEY, String.class))
                .setExpiredAt(expiredAt)
                .setJti(body.getId())
                .build();
    }
}
