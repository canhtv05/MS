package com.leaf.auth.security.jwt;

import com.leaf.auth.util.CookieUtil;
import org.springframework.security.config.annotation.SecurityConfigurer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

public record JWTConfigurer(TokenProvider tokenProvider, CookieUtil cookieUtil) implements
    SecurityConfigurer<DefaultSecurityFilterChain, HttpSecurity> {
    @Override
    public void init(HttpSecurity builder) throws Exception {}

    @Override
    public void configure(HttpSecurity builder) throws Exception {
        JWTFilter customFilter = new JWTFilter(tokenProvider, cookieUtil);
        builder.addFilterBefore(customFilter, UsernamePasswordAuthenticationFilter.class);
    }
}
