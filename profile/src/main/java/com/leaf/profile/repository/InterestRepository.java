package com.leaf.profile.repository;

import com.leaf.profile.domain.Interest;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface InterestRepository extends Neo4jRepository<Interest, String> {
    @Query(
        value = """
        MATCH (i:interest)
        WHERE $searchText IS NULL
           OR $searchText = ''
           OR toLower(i.title) CONTAINS toLower($searchText)
           OR toLower(i.code) CONTAINS toLower($searchText)
        RETURN i
        ORDER BY i.created_date DESC
        SKIP $skip
        LIMIT $limit
        """,
        countQuery = """
        MATCH (i:interest)
        WHERE $searchText IS NULL
           OR $searchText = ''
           OR toLower(i.title) CONTAINS toLower($searchText)
           OR toLower(i.code) CONTAINS toLower($searchText)
        RETURN count(i)
        """
    )
    Page<Interest> findAll(@Param("searchText") String searchText, Pageable pageable);

    @Query(
        """
        MERGE (i:interest {code: toLower($code)})
        ON CREATE SET i.id = randomUUID()
        SET i.title = $title,
            i.color = $color,
            i.created_by = $createdBy,
            i.created_date = datetime(),
            i.modified_by = $modifiedBy,
            i.modified_date = datetime()
        RETURN i
        """
    )
    Interest createIfNotExists(
        @Param("code") String code,
        @Param("title") String title,
        @Param("color") String color,
        @Param("createdBy") String createdBy,
        @Param("modifiedBy") String modifiedBy
    );

    @Query(
        """
        MATCH (u:user_profile_introduce {user_id: $userId})-[:INTERESTED_IN]->(i:interest)
        RETURN i
        """
    )
    List<Interest> findInterestsByUserId(@Param("userId") String userId);
}
