package com.leaf.profile.config;

import com.leaf.framework.blocking.security.SecurityCustomizer;
import com.leaf.framework.constant.CommonConstants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Configuration(proxyBeanMethods = false)
@Component(value = "profileSecurityConfig")
public class ProfileSecurityConfig {

    @Bean
    public SecurityCustomizer securityCustomizer() {
        return httpSecurity -> {
            httpSecurity.authorizeHttpRequests(request ->
                request
                    .requestMatchers(CommonConstants.PROFILE_PUBLIC_ENDPOINTS)
                    .permitAll()
                    .anyRequest()
                    .authenticated()
            );
        };
    }
}
