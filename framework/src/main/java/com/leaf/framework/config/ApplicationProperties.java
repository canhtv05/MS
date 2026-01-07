package com.leaf.framework.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = true)
public class ApplicationProperties {

    private RedisConfig redis = new RedisConfig();
    private SecurityConfig security = new SecurityConfig();

    @Getter
    @Setter
    public static class SecurityConfig {

        private String base64Secret;
        private Long validDurationInSeconds;
        private Long refreshDurationInSeconds;
        private String cookieDomain;
    }

    @Getter
    @Setter
    public static class RedisConfig {

        private String clientName;
        private String address;
        private String password;
        private Integer minimumIdle;
        private Integer maxPoolSize;
    }
}
