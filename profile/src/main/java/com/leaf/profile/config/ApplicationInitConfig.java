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
                        MERGE (u:user_profile {id: (row.id)})
                        SET u.user_id = row.user_id, u.username = row.username, u.email = row.email, u.created_by = row.created_by, u.modified_by = row.modified_by
                        """;

                session.executeWrite(ex -> {
                    ex.run(cypher);
                    return null;
                });
            }
        };
    }
}
