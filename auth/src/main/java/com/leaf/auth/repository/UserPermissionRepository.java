package com.leaf.auth.repository;

import com.leaf.auth.domain.UserPermission;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPermissionRepository extends JpaRepository<UserPermission, String> {
    List<UserPermission> findAllByUserId(Long userId);

    @Modifying
    void deleteAllByUserId(Long userId);
}
