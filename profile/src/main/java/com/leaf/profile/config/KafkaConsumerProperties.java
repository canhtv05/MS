package com.leaf.profile.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "spring.kafka")
public class KafkaConsumerProperties {

    private String bootstrapServers;
    private Consumer consumer;

    @Getter
    @Setter
    public static class Consumer {

        private String keyDeserializer;
        private String valueDeserializer;
        private String trustedPackages;
    }
}
