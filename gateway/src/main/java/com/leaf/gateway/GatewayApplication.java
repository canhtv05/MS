package com.leaf.gateway;

import com.leaf.framework.config.ApplicationProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

@SpringBootApplication
@EnableConfigurationProperties(ApplicationProperties.class)
@ComponentScan(
    basePackages = { "com.leaf.gateway", "com.leaf.common", "com.leaf.framework" },
    excludeFilters = {
        // Exclude entire blocking package (for Spring MVC/servlet stack only)
        // Gateway uses reactive stack, so only reactive package should be scanned
        @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.leaf\\.framework\\.blocking\\..*")
    }
)
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
