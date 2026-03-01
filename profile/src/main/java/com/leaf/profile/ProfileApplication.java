package com.leaf.profile;

import com.leaf.profile.config.KafkaConsumerProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

@SpringBootApplication(scanBasePackages = { "com.leaf" })
@EnableConfigurationProperties({ KafkaConsumerProperties.class })
@ComponentScan(
    basePackages = { "com.leaf" },
    excludeFilters = {
        @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.leaf\\.framework\\.reactive\\..*")
    }
)
public class ProfileApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProfileApplication.class, args);
    }
}
