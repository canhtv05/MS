package com.leaf.framework.config;

import io.github.cdimascio.dotenv.Dotenv;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;

@Slf4j
public class EnvLoader implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        loadEnv(".env.dev");
        loadEnv(".env");
    }

    private void loadEnv(String filename) {
        try {
            Dotenv dotenv = Dotenv.configure().filename(filename).ignoreIfMissing().load();

            dotenv
                .entries()
                .forEach(e -> {
                    if (System.getProperty(e.getKey()) == null) {
                        System.setProperty(e.getKey(), e.getValue());
                    }
                });
        } catch (Exception e) {
            log.error("framework: failed to load environment variables from {}", filename, e);
        }
    }
}
