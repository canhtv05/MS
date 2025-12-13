package com.leaf.noti.repository;

import com.leaf.noti.domain.EmailVerificationLogs;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailVerificationLogsRepository extends MongoRepository<EmailVerificationLogs, String> {
    Optional<EmailVerificationLogs> findByToken(String token);

    Optional<EmailVerificationLogs> findByUserId(String userId);
}
