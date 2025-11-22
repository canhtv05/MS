package com.leaf.noti.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

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
        private String groupId;
        private String keyDeserializer;
        private String valueDeserializer;
        private String trustedPackages;
    }
}
