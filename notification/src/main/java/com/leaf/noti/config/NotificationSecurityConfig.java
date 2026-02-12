package com.leaf.noti.config;

import com.leaf.framework.blocking.security.SecurityCustomizer;
import com.leaf.framework.constant.CommonConstants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NotificationSecurityConfig {

    @Bean
    SecurityCustomizer securityCustomizer() {
        return httpSecurity -> {
            httpSecurity.authorizeHttpRequests(request ->
                request
                    .requestMatchers(CommonConstants.NOTIFICATION_PUBLIC_ENDPOINTS)
                    .permitAll()
                    .anyRequest()
                    .authenticated()
            );
        };
    }
}
