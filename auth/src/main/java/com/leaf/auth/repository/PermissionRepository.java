package com.leaf.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.leaf.auth.domain.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, String> {
}