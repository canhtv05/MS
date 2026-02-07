package com.leaf.profile.repository;

import com.leaf.profile.domain.Interest;
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
           OR toLower(i.color) CONTAINS toLower($searchText)
        RETURN i
        SKIP $skip
        LIMIT $limit
        """,
        countQuery = """
        MATCH (i:interest)
        WHERE $searchText IS NULL
           OR $searchText = ''
           OR toLower(i.title) CONTAINS toLower($searchText)
           OR toLower(i.color) CONTAINS toLower($searchText)
        RETURN count(i)
        """
    )
    Page<Interest> findAll(@Param("searchText") String searchText, Pageable pageable);
}
