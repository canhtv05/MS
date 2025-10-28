package com.canhtv05.auth.service;

import com.canhtv05.auth.core.GenericCache;
import com.canhtv05.auth.dto.PermissionSelect;
import com.canhtv05.auth.dto.RoleSelect;
import com.canhtv05.auth.enums.CacheKey;
import com.canhtv05.auth.repository.PermissionRepository;
import com.canhtv05.auth.repository.RoleRepository;
import com.canhtv05.common.security.AuthoritiesConstants;
import com.canhtv05.common.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
        List<PermissionSelect> permissions = permissionRepository.findAll().stream()
                .map(PermissionSelect::fromEntity)
                .toList();
        if (!permissions.isEmpty()) {
            permissionCache.put(CacheKey.LIST_PERMISSION.name(), permissions);
        }
        return permissions;
    }

    public List<RoleSelect> getRoleSelect() {
        List<RoleSelect> roles = roleRepository.findAll().stream()
                .map(RoleSelect::fromEntity)
                .toList();
        if (!SecurityUtils.isGlobalSuperAdmin()) {
            return roles.stream()
                    .filter(t -> !AuthoritiesConstants.SUPER_ADMIN.equalsIgnoreCase(t.code()))
                    .toList();
        }
        return roles;
    }
}
