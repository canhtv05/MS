package com.canhtv05.auth.config;

import com.canhtv05.auth.core.GenericCache;

import com.canhtv05.auth.dto.PermissionSelect;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class CacheConfig {

    @Bean
    public GenericCache<String, List<PermissionSelect>> permissionCache() {
        return new GenericCache<>();
    }
}
