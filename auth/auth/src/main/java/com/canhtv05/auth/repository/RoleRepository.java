package com.canhtv05.auth.repository;

import com.canhtv05.auth.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {

    Optional<Role> findByCode(String code);

    List<Role> findAllByCodeIn(List<String> codes);

}