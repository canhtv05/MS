package com.leaf.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.leaf.auth.config.ApplicationProperties;

@EnableConfigurationProperties({ ApplicationProperties.class })
@SpringBootApplication(scanBasePackages = { "com.leaf", "com.leaf.common" })
public class AuthApplication {
	public static void main(String[] args) {
		io.github.cdimascio.dotenv.Dotenv dotenv = io.github.cdimascio.dotenv.Dotenv.configure()
				.filename(".env.dev")
				.ignoreIfMissing()
				.load();

		dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));

		SpringApplication.run(AuthApplication.class, args);
	}
}
