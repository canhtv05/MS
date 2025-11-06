package com.leaf.profile.repository;

import com.leaf.profile.domain.UserProfile;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends Neo4jRepository<UserProfile, Long> {

    Optional<UserProfile> findByUserId(Long userId);

    Optional<UserProfile> findByEmail(String email);

    @Query("""
                MATCH (s:user_profile {user_id: $senderId})-[r:SENDER]->(t:user_profile {user_id: $receiverId})
                RETURN r
            """)
    Optional<Object> findFriendRequestBetween(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);

    @Query("""
                MATCH (s:user_profile {user_id: $senderId}), (t:user_profile {user_id: $receiverId})
                CREATE (s)-[r:SENDER {id: randomUUID(), status: 'PENDING'}]->(t)
                RETURN r
            """)
    void createFriendRequest(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);

    @Query("""
                MATCH (s:user_profile {user_id: $senderId})-[r:SENDER]->(t:user_profile {user_id: $receiverId})
                DELETE r
            """)
    void deleteFriendRequest(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);

    @Query("""
                MATCH (s:user_profile {user_id: $senderId})-[r:SENDER]->(t:user_profile {user_id: $receiverId})
                SET r.status = $status
                RETURN r
            """)
    void updateFriendRequestStatus(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId,
            @Param("status") String status);
}
