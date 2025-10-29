package com.canhtv05.auth.repository;

import com.canhtv05.auth.domain.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    // auto join query, avoid n+1 query
    @EntityGraph(attributePaths = { "roles", "roles.permissions" })
    Optional<User> findOneWithAuthoritiesByUsername(String userName);

    Boolean existsUserByUsername(String username);

    Boolean existsUserByEmail(String email);

    Optional<User> findByUsername(String username);

    @Query(nativeQuery = true, value = "select t.username from users t where t.username in (:usernames)")
    List<String> findUserExitsUsername(List<String> usernames);

    @Query(nativeQuery = true, value = "select t.email from users t where t.email in (:emails)")
    List<String> findUserExitsEmail(List<String> emails);
}