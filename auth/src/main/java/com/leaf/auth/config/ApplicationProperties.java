package com.leaf.auth.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {

    private SecurityConfig security;

    @Getter
    @Setter
    public static class SecurityConfig {

        private String base64Secret;
        private Long validDurationInSeconds;
        private Long refreshDurationInSeconds;
    }
}
