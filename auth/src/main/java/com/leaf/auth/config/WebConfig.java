package com.leaf.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class WebConfig {

    @Bean
    CorsFilter corsFilter() {
        return new CorsFilter(request -> null);
    }
}
