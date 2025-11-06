package com.leaf.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.leaf.auth.security.jwt.TokenProvider;

import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.security.authentication.BearerAuthenticationReader;
import net.devh.boot.grpc.server.security.authentication.GrpcAuthenticationReader;

@Configuration
@RequiredArgsConstructor
class GrpcSecurityConfig {

  private final TokenProvider tokenProvider;

  @Bean
  GrpcAuthenticationReader grpcAuthenticationReader() {
    return new BearerAuthenticationReader(token -> {
      return tokenProvider.getAuthentication(token);
    });
  }
}