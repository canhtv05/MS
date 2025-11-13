package com.leaf.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProviderPostgres")
public class AuditPostgresConfig {

    @Bean
    public AuditorAware<String> auditorProviderPostgres() {
        return new AuditorAwareImpl();
    }
}
