package com.leaf.auth.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.leaf.auth.domain.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    // auto join query, avoid n+1 query
    @EntityGraph(attributePaths = { "roles", "roles.permissions" })
    Optional<User> findOneWithAuthoritiesByUsername(String userName);

    boolean existsByEmail(String email);

    @EntityGraph(attributePaths = "roles")
    Optional<User> findById(Long id);

    Boolean existsUserByUsername(String username);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    @Query(nativeQuery = true, value = "select t.username from users t where t.username in (:usernames)")
    List<String> findUserExitsUsername(List<String> usernames);
}