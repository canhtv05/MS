package com.leaf.framework.blocking.security;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@FunctionalInterface
public interface SecurityCustomizer {
    void customize(HttpSecurity httpSecurity) throws Exception;
}
