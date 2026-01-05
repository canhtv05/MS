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

                    MERGE (profile:user_profile {id: row.id})
                    SET profile.user_id = row.user_id,
                        profile.fullname = row.fullname,
                        profile.followers_count = toInteger(row.followers_count),
                        profile.following_count = toInteger(row.following_count),
                        profile.created_by = row.created_by,
                        profile.bio = row.bio,
                        profile.cover_url = row.cover_url,
                        profile.avatar_url = row.avatar_url,
                        profile.last_online_at = datetime(row.last_online_at),
                        profile.modified_by = row.modified_by,
                        profile.created_date = datetime(row.created_date),
                        profile.modified_date = datetime(row.created_date)

                    MERGE (introduce:user_profile_introduce {id: row.id + '-introduce'})
                    SET introduce.city = row.city,
                        introduce.dob = date(row.dob),
                        introduce.gender = row.gender,
                        introduce.phone_number = row.phone_number,
                        introduce.facebook_url = row.facebook_url,
                        introduce.tiktok_url = row.tiktok_url,
                        introduce.created_by = row.created_by,
                        introduce.modified_by = row.modified_by,
                        introduce.created_date = datetime(row.created_date),
                        introduce.modified_date = datetime(row.created_date)

                    MERGE (privacy:user_profile_privacy {id: row.id + '-privacy'})
                    SET privacy.profile_visibility = row.profile_visibility,
                        privacy.friends_visibility = row.friends_visibility,
                        privacy.posts_visibility = row.posts_visibility,
                        privacy.created_by = row.created_by,
                        privacy.modified_by = row.modified_by,
                        privacy.created_date = datetime(row.created_date),
                        privacy.modified_date = datetime(row.created_date)

                    MERGE (profile)-[:HAS_INTRODUCE]->(introduce)
                    MERGE (profile)-[:HAS_PRIVACY]->(privacy)
                    """;

                session.executeWrite(ex -> {
                    ex.run(cypher);
                    return null;
                });
            }
        };
    }
}
