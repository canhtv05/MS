package com.leaf.auth;

import com.leaf.framework.blocking.security.SecurityConfig;
import com.leaf.framework.config.ApplicationProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

@SpringBootApplication
@EnableCaching
@EnableConfigurationProperties(ApplicationProperties.class)
@ComponentScan(
    basePackages = { "com.leaf.auth", "com.leaf.common", "com.leaf.framework" },
    excludeFilters = {
        // Exclude entire reactive package (for Spring WebFlux/reactive stack only)
        // Auth uses blocking stack, so only blocking package should be scanned
        @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.leaf\\.framework\\.reactive\\..*"),
        // Exclude SecurityConfig from blocking (auth has its own security config)
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = SecurityConfig.class)
    }
)
public class AuthApplication {

    public static void main(String[] args) {
        io.github.cdimascio.dotenv.Dotenv dotenv = io.github.cdimascio.dotenv.Dotenv.configure()
            .filename(".env.dev")
            .ignoreIfMissing()
            .load();

        dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));

        SpringApplication.run(AuthApplication.class, args);
    }
}
