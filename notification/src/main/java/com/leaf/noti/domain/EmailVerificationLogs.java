package com.leaf.noti.domain;

import com.leaf.noti.enums.VerificationStatus;
import java.time.Instant;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

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

    @Indexed(unique = true)
    String userId;

    String fullname;
    Instant verifiedAt;
    Instant expiredAt;
    String token;
    String email;
    VerificationStatus verificationStatus;
}
