package com.leaf.profile.repository;

import com.leaf.profile.domain.UserProfile;
import com.leaf.profile.dto.SendFriendRequestDTO;
import java.util.Optional;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserProfileRepository extends Neo4jRepository<UserProfile, String> {
    @Query(
        """
        MATCH (u:user_profile {user_id: $userId})
        RETURN u
        """
    )
    Optional<UserProfile> findByUserId(@Param("userId") String userId);

    @Query(
        """
        MATCH (u:user_profile {user_id: $userId})
        RETURN u.id as id
        """
    )
    Optional<String> findByUserIdReturnString(@Param("userId") String userId);

    boolean existsByUserId(@Param("userId") String userId);

    @Query(
        """
        MATCH (sender:user_profile {user_id: $senderName})
        MATCH (receiver:user_profile {user_id: $receiverName})
        CREATE (sender)-[fq:FRIEND_REQUESTS {
        	id: randomUUID(),
        	status: 'PENDING',
        	send_at: datetime()
        }]->(receiver)
        RETURN
        	sender.user_id AS senderName,
        	receiver.user_id AS receiverName,
        	fq.send_at AS sendAt,
        	fq.status AS status
        """
    )
    SendFriendRequestDTO sendFriendRequest(
        @Param("senderName") String senderName,
        @Param("receiverName") String receiverName
    );

    @Query(
        """
        MATCH (sender:user_profile {user_id: $senderName})-[r:FRIEND_REQUESTS]->(receiver:user_profile {user_id:$receiverName})
        return COUNT(r) > 0
        """
    )
    boolean isSent(@Param(value = "senderName") String senderName, @Param("receiverName") String receiverName);

    @Query(
        """
        MATCH (fq:FRIEND_REQUESTS {id: $id})
        DELETE fq
        """
    )
    void deleteFriendRequest(@Param("id") String id);
}
