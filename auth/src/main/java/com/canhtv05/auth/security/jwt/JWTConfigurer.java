package com.canhtv05.auth.security.jwt;

import org.springframework.security.config.annotation.SecurityConfigurer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

public record JWTConfigurer(TokenProvider tokenProvider, String nameApplication)
        implements SecurityConfigurer<DefaultSecurityFilterChain, HttpSecurity> {

    @Override
    public void init(HttpSecurity builder) throws Exception {

    }

    @Override
    public void configure(HttpSecurity builder) throws Exception {
        JWTFilter customFilter = new JWTFilter(tokenProvider, nameApplication);
        builder.addFilterBefore(customFilter, UsernamePasswordAuthenticationFilter.class);
    }
}
