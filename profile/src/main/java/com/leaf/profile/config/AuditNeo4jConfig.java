package com.leaf.profile.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.neo4j.config.EnableNeo4jAuditing;

@Configuration
@EnableNeo4jAuditing(auditorAwareRef = "auditorProviderNeo4j")
public class AuditNeo4jConfig {

    @Bean
    public AuditorAware<String> auditorProviderNeo4j() {
        return new AuditorAwareImpl();
    }
}
