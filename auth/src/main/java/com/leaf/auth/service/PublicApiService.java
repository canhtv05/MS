package com.leaf.auth.service;

import com.leaf.auth.core.GenericCache;
import com.leaf.auth.dto.PermissionSelect;
import com.leaf.auth.dto.RoleSelect;
import com.leaf.auth.enums.CacheKey;
import com.leaf.auth.repository.PermissionRepository;
import com.leaf.auth.repository.RoleRepository;
import com.leaf.framework.security.AuthoritiesConstants;
import com.leaf.framework.security.SecurityUtils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class PublicApiService {

    private final GenericCache<String, List<PermissionSelect>> permissionCache;
    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;

    public List<PermissionSelect> getPermissionSelect() {
        if (permissionCache.get(CacheKey.LIST_PERMISSION.name()).isPresent()) {
            return permissionCache.get(CacheKey.LIST_PERMISSION.name()).get();
        }
        List<PermissionSelect> permissions = permissionRepository
            .findAll()
            .stream()
            .map(PermissionSelect::fromEntity)
            .toList();
        if (!permissions.isEmpty()) {
            permissionCache.put(CacheKey.LIST_PERMISSION.name(), permissions);
        }
        return permissions;
    }

    public List<RoleSelect> getRoleSelect() {
        List<RoleSelect> roles = roleRepository.findAll().stream().map(RoleSelect::fromEntity).toList();
        if (!SecurityUtils.isGlobalSuperAdmin()) {
            return roles
                .stream()
                .filter(t -> !AuthoritiesConstants.SUPER_ADMIN.equalsIgnoreCase(t.code()))
                .toList();
        }
        return roles;
    }
}
