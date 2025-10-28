package com.canhtv05.auth.config;

import com.fasterxml.jackson.annotation.JsonProperty;
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

        @JsonProperty("base64-secret")
        private String base64Secret;

        @JsonProperty("token-validity-in-seconds")
        private Long tokenValidityInSeconds;
    }
}
