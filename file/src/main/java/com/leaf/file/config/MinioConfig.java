package com.leaf.file.config;

import io.minio.MinioClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfig {

    @Bean
    MinioClient minioClient(ApplicationProperties applicationProperties) {
        return MinioClient.builder()
            .endpoint(applicationProperties.getUrl())
            .credentials(applicationProperties.getAccessKey(), applicationProperties.getSecretKey())
            .build();
    }
}
