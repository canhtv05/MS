package com.leaf.noti;

import com.leaf.noti.config.EmailProperties;
import com.leaf.noti.config.KafkaConsumerProperties;
import com.leaf.noti.config.NotificationProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

@SpringBootApplication
@EnableConfigurationProperties({ KafkaConsumerProperties.class, EmailProperties.class, NotificationProperties.class })
@ComponentScan(
    basePackages = { "com.leaf" },
    excludeFilters = {
        @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.leaf\\.framework\\.reactive\\..*")
    }
)
public class NotificationApplication {

    public static void main(String[] args) {
        io.github.cdimascio.dotenv.Dotenv dotenv = io.github.cdimascio.dotenv.Dotenv.configure()
            .filename(".env.dev")
            .ignoreIfMissing()
            .load();

        dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));

        SpringApplication.run(NotificationApplication.class, args);
    }
}
