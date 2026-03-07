package com.leaf.auth.config;

import com.leaf.auth.dto.PermissionSelect;
import com.leaf.framework.blocking.config.cache.InMemoryCacheService;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CacheConfig {

    @Bean
    InMemoryCacheService<String, List<PermissionSelect>> permissionCache() {
        return new InMemoryCacheService<>();
    }
}
