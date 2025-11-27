package com.leaf.noti.domain;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import com.leaf.noti.enums.VerificationStatus;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Document(collection = "email_verification_logs")
public class EmailVerificationLogs {

    @MongoId
    String id;
    String jti;
    String userId;
    Instant verifiedAt;
    Instant expiredAt;
    String token;
    VerificationStatus verificationStatus;
}
