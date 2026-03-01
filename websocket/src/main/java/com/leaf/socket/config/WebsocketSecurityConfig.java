package com.leaf.socket.config;

import com.leaf.framework.blocking.security.SecurityCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class WebsocketSecurityConfig {

    @Bean
    SecurityCustomizer securityCustomizer() {
        return httpSecurity -> httpSecurity.authorizeHttpRequests(request -> request.anyRequest().permitAll());
    }
}
