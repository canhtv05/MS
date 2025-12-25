package com.leaf.profile.repository;

import com.leaf.profile.domain.MediaHistory;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MediaHistoryRepository extends Neo4jRepository<MediaHistory, String> {
    Page<MediaHistory> findByUserId(String userId, Pageable pageable);

    Page<MediaHistory> findByUserIdAndType(String userId, String type, Pageable pageable);

    @Query(
        value = """
        MATCH (m:media_history)
        WHERE m.user_id = $userId
        AND (
            toLower(m.url) CONTAINS toLower($searchText)
            OR toLower(m.type) CONTAINS toLower($searchText)
        )
        RETURN m
        ORDER BY m.created_at DESC
        """,
        countQuery = """
        MATCH (m:media_history)
        WHERE m.user_id = $userId
        AND (
            toLower(m.url) CONTAINS toLower($searchText)
            OR toLower(m.type) CONTAINS toLower($searchText)
        )
        RETURN count(m)
        """
    )
    Page<MediaHistory> searchByUserIdAndText(
        @Param("userId") String userId,
        @Param("searchText") String searchText,
        Pageable pageable
    );

    @Query(
        """
        MATCH (user: user_profile {user_id: $userId})
        CREATE(m:media_history {
            id: randomUUID(),
            user_id: $userId,
            url: $url,
            type: $type,
            created_at: datetime()
        })
        CREATE (user)-[:MEDIA_HISTORY]->(m)
        RETURN m
        """
    )
    void saveMediaHistory(String userId, String url, String type);

    Optional<MediaHistory> findByUserIdAndUrl(String userId, String url);
}
