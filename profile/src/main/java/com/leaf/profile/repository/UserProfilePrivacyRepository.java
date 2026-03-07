package com.leaf.profile.repository;

import com.leaf.profile.domain.UserProfilePrivacy;
import java.util.Optional;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserProfilePrivacyRepository extends Neo4jRepository<UserProfilePrivacy, String> {
    @Query(
        """
        MATCH (u:user_profile_privacy {user_id: $userId})
        RETURN u
        """
    )
    Optional<UserProfilePrivacy> findByUserId(@Param("userId") String userId);
}
