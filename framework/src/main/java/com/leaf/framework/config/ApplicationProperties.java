package com.leaf.framework.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = true)
public class ApplicationProperties {

    private RedisConfig redis = new RedisConfig();

    @Getter
    @Setter
    public static class RedisConfig {

        private String clientName = "leaf-client";
        private String address = "redis://localhost:6379";
        private String password = "";
        private Integer minimumIdle = 5;
        private Integer maxPoolSize = 10;
    }
}
