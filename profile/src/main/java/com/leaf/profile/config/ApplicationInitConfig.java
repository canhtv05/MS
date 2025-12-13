package com.leaf.profile.config;

import lombok.RequiredArgsConstructor;
import org.neo4j.driver.Driver;
import org.neo4j.driver.Session;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
                    MERGE (u:user_profile {id: row.id})
                    SET u.user_id = row.user_id,
                        u.fullname = row.fullname,
                        u.dob = date(row.dob),
                        u.city = row.city,
                        u.gender = row.gender,
                        u.bio = row.bio,
                        u.cover_url = row.cover_url,
                        u.phone_number = row.phone_number,
                        u.avatar_url = row.avatar_url,
                        u.social_links = split(row.social_links, ';'),
                        u.profile_visibility = row.profile_visibility,
                        u.friends_visibility = row.friends_visibility,
                        u.posts_visibility = row.posts_visibility,
                        u.followers_count = toInteger(row.followers_count),
                        u.following_count = toInteger(row.following_count),
                        u.created_by = row.created_by,
                        u.modified_by = row.modified_by,
                        u.created_date = datetime(row.created_date)
                    """;

                session.executeWrite(ex -> {
                    ex.run(cypher);
                    return null;
                });
            }
        };
    }
}
