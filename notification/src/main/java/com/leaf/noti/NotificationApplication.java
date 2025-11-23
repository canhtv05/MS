package com.leaf.noti;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.leaf.noti.config.EmailProperties;
import com.leaf.noti.config.KafkaConsumerProperties;

@SpringBootApplication(scanBasePackages = { "com.leaf", "com.leaf.common" })
@EnableConfigurationProperties({ KafkaConsumerProperties.class, EmailProperties.class })
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
