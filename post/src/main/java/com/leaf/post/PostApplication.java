package com.leaf.post;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PostApplication {
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure()
                .filename(".env.dev") // đường dẫn file
                .ignoreIfMalformed()
                .ignoreIfMissing()
                .load();

        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        SpringApplication.run(PostApplication.class, args);
    }
}
