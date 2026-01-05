package com.leaf.profile.repository;

import com.leaf.profile.domain.UserProfileIntroduce;
import java.util.Optional;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserProfileIntroduceRepository extends Neo4jRepository<UserProfileIntroduce, String> {
    Optional<UserProfileIntroduce> findByUserId(String userId);
}
