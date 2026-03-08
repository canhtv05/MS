package com.leaf.file.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "minio", ignoreUnknownFields = true)
public class ApplicationProperties {

    private String url;
    private String accessKey;
    private String secretKey;
    private String bucket;
}
