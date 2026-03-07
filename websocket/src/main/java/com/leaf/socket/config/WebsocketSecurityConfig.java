package com.leaf.socket.config;

import com.leaf.framework.blocking.security.SecurityCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Configuration(proxyBeanMethods = false)
@Component(value = "websocketSecurityConfig")
public class WebsocketSecurityConfig {

    @Bean(name = "websocketSecurityCustomizer")
    SecurityCustomizer websocketSecurityCustomizer() {
        return httpSecurity -> {};
    }
}
