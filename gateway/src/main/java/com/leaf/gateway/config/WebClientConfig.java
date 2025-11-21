package com.leaf.gateway.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.reactive.function.client.WebClient;

import org.springframework.http.HttpHeaders;

@Configuration
public class WebClientConfig {

  @Bean
  WebClient webClient() {
    return WebClient.builder()
        .baseUrl("*")
        .build();
  }

  @Bean
  CorsWebFilter configurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowedMethods(List.of("*"));
    configuration.setAllowedOriginPatterns(List.of("http://localhost:3000", "https://web-client-azure.vercel.app"));
    configuration.setExposedHeaders(List.of(HttpHeaders.AUTHORIZATION));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
    urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", configuration);

    return new CorsWebFilter(urlBasedCorsConfigurationSource);
  }
}
