package com.leaf.profile.repository;

import com.leaf.profile.domain.UserProfilePrivacy;
import java.util.Optional;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserProfilePrivacyRepository extends Neo4jRepository<UserProfilePrivacy, String> {
    Optional<UserProfilePrivacy> findByUserId(String userId);
}
