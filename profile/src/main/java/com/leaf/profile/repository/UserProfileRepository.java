package com.leaf.profile.repository;

import com.leaf.profile.domain.UserProfile;
import com.leaf.profile.dto.SendFriendRequestDTO;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends Neo4jRepository<UserProfile, Long> {

    Optional<UserProfile> findByUsername(String username);

    boolean existsByEmail(String email);

    @Query("""
            MATCH (u:user_profile {user_id: $userId})
            RETURN u.id
            """)
    Optional<Long> findByUserId(@Param("userId") String userId);

    @Query("""
            MATCH (sender:user_profile {id: $senderId})
            MATCH (receiver:user_profile {id: $receiverId})
            CREATE (sender)-[fq:FRIEND_REQUESTS {status: 'PENDING', send_at: datetime()}]->(receiver)
            RETURN sender.id AS senderId,
                receiver.id AS receiverId,
                fq.send_at AS sendAt,
                fq.status AS status
            """)
    SendFriendRequestDTO sendFriendRequest(@Param(value = "senderId") Long senderId,
            @Param(value = "receiverId") Long receiverId);
}
