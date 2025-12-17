package com.leaf.auth.config;

import com.leaf.auth.core.GenericCache;
import com.leaf.auth.dto.PermissionSelect;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CacheConfig {

    @Bean
    GenericCache<String, List<PermissionSelect>> permissionCache() {
        return new GenericCache<>();
    }
}
