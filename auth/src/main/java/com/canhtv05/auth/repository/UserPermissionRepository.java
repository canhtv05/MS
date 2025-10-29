package com.canhtv05.auth.repository;

import com.canhtv05.auth.domain.UserPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserPermissionRepository extends JpaRepository<UserPermission, String> {

    List<UserPermission> findAllByUserId(Long userId);

    @Modifying
    void deleteAllByUserId(Long userId);
}