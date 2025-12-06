package com.leaf.auth.config;

import com.leaf.auth.exception.CustomAuthenticationException;
import com.leaf.auth.security.CustomAuthenticationProvider;
import com.leaf.auth.security.jwt.JWTConfigurer;
import com.leaf.auth.security.jwt.TokenProvider;
import com.leaf.auth.util.AuthUtil;
import com.leaf.common.constant.CommonConstants;
import com.leaf.common.dto.ResponseObject;
import com.leaf.common.utils.JsonF;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Objects;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfig {

    private final TokenProvider tokenProvider;
    private final AuthUtil authUtil;
    private final CorsFilter corsFilter;

    public SecurityConfig(
        TokenProvider tokenProvider,
        CorsFilter corsFilter,
        ApplicationProperties applicationProperties,
        AuthUtil authUtil
    ) {
        this.tokenProvider = tokenProvider;
        this.corsFilter = corsFilter;
        this.authUtil = authUtil;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public AuthenticationManager authenticationManager(
        HttpSecurity http,
        CustomAuthenticationProvider customProvider
    ) throws Exception {
        return http
            .getSharedObject(AuthenticationManagerBuilder.class)
            .authenticationProvider(customProvider)
            .build();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(exceptionHandling ->
                exceptionHandling
                    .authenticationEntryPoint(authenticationEntryPoint())
                    .accessDeniedHandler(accessDeniedHandler())
            )
            .sessionManagement(sessionManagement ->
                sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(authorizeRequests ->
                authorizeRequests
                    .requestMatchers(HttpMethod.OPTIONS, "/**")
                    .permitAll()
                    .requestMatchers(CommonConstants.AUTH_PUBLIC_ENDPOINTS)
                    .permitAll()
                    .anyRequest()
                    .authenticated()
            )
            .apply(securityConfigurerAdapter());
        return http.build();
    }

    private JWTConfigurer securityConfigurerAdapter() {
        return new JWTConfigurer(tokenProvider, authUtil);
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> {
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            if (authException instanceof CustomAuthenticationException ex) {
                response.setStatus(ex.getHttpStatus().value());
                response
                    .getWriter()
                    .write(
                        Objects.requireNonNull(
                            JsonF.toJson(
                                ResponseObject.error(
                                    String.valueOf(ex.getHttpStatus().value()),
                                    ex.getMessage()
                                )
                            )
                        )
                    );
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response
                    .getWriter()
                    .write(
                        Objects.requireNonNull(
                            JsonF.toJson(ResponseObject.error("401", authException.getMessage()))
                        )
                    );
            }
        };
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response
                .getWriter()
                .write(
                    Objects.requireNonNull(
                        JsonF.toJson(
                            ResponseObject.error("403", accessDeniedException.getMessage())
                        )
                    )
                );
        };
    }
}
