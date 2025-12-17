package com.leaf.auth.repository;

import com.leaf.auth.domain.Role;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    Optional<Role> findByCode(String code);

    List<Role> findAllByCodeIn(List<String> codes);
}
