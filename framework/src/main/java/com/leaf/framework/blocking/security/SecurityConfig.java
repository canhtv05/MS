package com.leaf.framework.blocking.security;

import java.util.List;
import java.util.Optional;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Blocking security configuration for Spring MVC applications.
 * Only loaded when spring-security-oauth2-resource-server is on classpath.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
@ConditionalOnClass(name = "org.springframework.security.oauth2.jwt.JwtDecoder")
public class SecurityConfig {

    private final CustomJwtDecoder customJwtDecoder;
    private final List<SecurityCustomizer> securityCustomizers;

    public SecurityConfig(CustomJwtDecoder customJwtDecoder, Optional<List<SecurityCustomizer>> securityCustomizers) {
        this.customJwtDecoder = customJwtDecoder;
        this.securityCustomizers = securityCustomizers.orElse(List.of());
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        // Apply customizers first (for authorizeHttpRequests customization)
        // Each service should provide exactly one SecurityCustomizer bean
        for (SecurityCustomizer customizer : securityCustomizers) {
            customizer.customize(httpSecurity);
        }

        // If no customizer provided, use default: all requests require authentication
        if (securityCustomizers.isEmpty()) {
            httpSecurity.authorizeHttpRequests(request -> request.anyRequest().authenticated());
        }

        // Common OAuth2 Resource Server configuration (applied after
        // authorizeHttpRequests)
        httpSecurity
            .oauth2ResourceServer(oauth2 ->
                oauth2
                    .jwt(jwtConfigurer ->
                        jwtConfigurer.decoder(customJwtDecoder).jwtAuthenticationConverter(jwtAuthenticationConverter())
                    )
                    .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
            )
            .csrf(AbstractHttpConfigurer::disable);

        return httpSecurity.build();
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");
        jwtGrantedAuthoritiesConverter.setAuthoritiesClaimName("auth");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }
}
