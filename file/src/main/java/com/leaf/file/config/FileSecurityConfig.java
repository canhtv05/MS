package com.leaf.file.config;

import com.leaf.framework.blocking.security.SecurityCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

@Configuration(proxyBeanMethods = false)
@Component(value = "fileSecurityConfig")
public class FileSecurityConfig {

    private static final String[] PUBLIC_ENDPOINTS = {};

    @Bean
    SecurityCustomizer securityCustomizer() {
        return httpSecurity -> {
            httpSecurity.authorizeHttpRequests(request ->
                request.requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS).permitAll().anyRequest().authenticated()
            );
        };
    }
}
