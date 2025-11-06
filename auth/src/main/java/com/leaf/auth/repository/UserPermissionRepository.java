package com.leaf.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.leaf.auth.domain.UserPermission;

import java.util.List;

@Repository
public interface UserPermissionRepository extends JpaRepository<UserPermission, String> {

    List<UserPermission> findAllByUserId(Long userId);

    @Modifying
    void deleteAllByUserId(Long userId);
}