package com.canhtv05.auth.security.jwt;

import org.springframework.security.config.annotation.SecurityConfigurer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.canhtv05.auth.utils.CookieUtil;

public record JWTConfigurer(TokenProvider tokenProvider, CookieUtil cookieUtil)
        implements SecurityConfigurer<DefaultSecurityFilterChain, HttpSecurity> {

    @Override
    public void init(HttpSecurity builder) throws Exception {

    }

    @Override
    public void configure(HttpSecurity builder) throws Exception {
        JWTFilter customFilter = new JWTFilter(tokenProvider, cookieUtil);
        builder.addFilterBefore(customFilter, UsernamePasswordAuthenticationFilter.class);
    }
}
