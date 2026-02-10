package com.leaf.noti.util;

import com.google.protobuf.Timestamp;
import com.leaf.common.dto.event.VerificationEmailEvent;
import com.leaf.common.grpc.VerifyEmailTokenDTO;
import com.leaf.common.utils.AESUtils;
import com.leaf.common.utils.CommonUtils;
import com.leaf.noti.config.NotificationProperties;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TokenUtil {

    private final NotificationProperties notificationProperties;
    private static final String EMAIL_KEY = "email";
    private static final String FULLNAME_KEY = "fullname";

    private String getSecret() {
        return notificationProperties.getSecretKey();
    }

    public SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(VerificationEmailEvent request, Date expiredAt) {
        return Jwts.builder()
            .setId(UUID.randomUUID().toString())
            .setSubject(request.getUsername())
            .claim(EMAIL_KEY, request.getTo())
            .claim(FULLNAME_KEY, request.getFullName())
            .setIssuedAt(new Date())
            .setExpiration(expiredAt)
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    public VerifyEmailTokenDTO parseToken(String token) {
        var body = Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();

        Date exp = body.getExpiration();

        Timestamp expiredAt = Timestamp.newBuilder().setSeconds(exp.getTime() / 1000).setNanos(0).build();

        return VerifyEmailTokenDTO.newBuilder()
            .setUsername(body.getSubject())
            .setEmail(body.get(EMAIL_KEY, String.class))
            .setFullname(CommonUtils.getSafeObject(body.get(FULLNAME_KEY, String.class), String.class, ""))
            .setExpiredAt(expiredAt)
            .setJti(body.getId())
            .build();
    }

    public String encryptToken(String rawToken) {
        try {
            return AESUtils.encrypt(rawToken, getSecret());
        } catch (Exception e) {
            throw new RuntimeException("Failed to encrypt token", e);
        }
    }

    public String decryptToken(String encryptedToken) {
        try {
            return AESUtils.decrypt(encryptedToken, getSecret());
        } catch (Exception e) {
            throw new RuntimeException("Failed to decrypt token", e);
        }
    }
}
