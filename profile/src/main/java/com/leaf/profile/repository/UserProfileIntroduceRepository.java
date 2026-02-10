package com.leaf.profile.repository;

import com.leaf.profile.domain.UserProfileIntroduce;
import java.util.Optional;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserProfileIntroduceRepository extends Neo4jRepository<UserProfileIntroduce, String> {
    @Query(
        """
        MATCH (u:user_profile_introduce {user_id: $userId})
        RETURN u
        """
    )
    Optional<UserProfileIntroduce> findByUserId(@Param("userId") String userId);
}
