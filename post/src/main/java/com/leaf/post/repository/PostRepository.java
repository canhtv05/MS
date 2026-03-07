package com.leaf.post.repository;

import com.leaf.post.domain.Post;
import java.util.List;
import java.util.Optional;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends Neo4jRepository<Post, String> {
    @Query(
        """
        MATCH (u:user_profile {id: $userId})
        CREATE (p:post {
            id: randomUUID(),
            content: $content,
            visibility: $visibility,
            status: 'ACTIVE',
            createdDate: datetime(),
            modifiedDate: datetime()
        })
        CREATE (p)-[:CREATED_BY]->(u)
        RETURN p
        """
    )
    Post createPost(
        @Param("userId") String userId,
        @Param("content") String content,
        @Param("visibility") String visibility
    );

    @Query(
        """
        MATCH (u:user_profile {id: $userId})<-[:CREATED_BY]-(p:post)
        WHERE p.status = 'ACTIVE'
        RETURN p
        ORDER BY p.createdDate DESC
        """
    )
    List<Post> findPostsByUserId(@Param("userId") String userId);

    @Query(
        """
        MATCH (p:post {id: $postId})
        SET p.status = 'DELETED',
            p.modifiedDate = datetime()
        RETURN p
        """
    )
    Optional<Post> softDelete(@Param("postId") String postId);

    @Query(
        """
        MATCH (u:user_profile {id: $userId})<-[:CREATED_BY]-(p:post {id: $postId})
        RETURN COUNT(p) > 0
        """
    )
    boolean isOwner(@Param("userId") String userId, @Param("postId") String postId);
}
