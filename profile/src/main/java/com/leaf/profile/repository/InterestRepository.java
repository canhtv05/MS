package com.leaf.profile.repository;

import com.leaf.profile.domain.Interest;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterestRepository extends Neo4jRepository<Interest, String> {}
