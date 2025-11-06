package com.leaf.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.leaf.auth.core.GenericCache;
import com.leaf.auth.dto.PermissionSelect;

import java.util.List;

@Configuration
public class CacheConfig {

    @Bean
    public GenericCache<String, List<PermissionSelect>> permissionCache() {
        return new GenericCache<>();
    }
}
