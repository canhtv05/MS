package com.leaf.profile.config;

import org.neo4j.driver.Driver;
import org.neo4j.driver.Session;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class ApplicationInitConfig {

    private final Driver driver;

    @Bean
    ApplicationRunner applicationRunner() {
        return args -> {
            try (Session session = driver.session()) {
                String cypher = """
                        LOAD CSV WITH HEADERS FROM 'file:///user_profile.csv' AS row
                        MERGE (u:user_profile {id: toInteger(row.id)})
                        SET u.user_id = row.user_id, u.username = row.username, u.email = row.email
                        """;

                session.executeWrite(ex -> {
                    ex.run(cypher);
                    return null;
                });
            }
        };
    }
}
