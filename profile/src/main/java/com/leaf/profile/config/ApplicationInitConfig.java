package com.leaf.profile.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.neo4j.driver.Driver;
import org.neo4j.driver.Session;
import org.neo4j.driver.exceptions.DatabaseException;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class ApplicationInitConfig {

    private final Driver driver;

    @Bean
    ApplicationRunner applicationRunner() {
        return args -> {
            try (Session session = driver.session()) {
                initializeConstraints(session);
                loadCsvData(session);
            }
        };
    }

    private void initializeConstraints(Session session) {
        try {
            String createUniqueConstraintCypher = """
                CREATE CONSTRAINT interest_code_unique IF NOT EXISTS
                FOR (i:interest) REQUIRE i.code IS UNIQUE
                """;

            String createUniqueConstraintInterestIdCypher = """
                CREATE CONSTRAINT interest_id_unique IF NOT EXISTS
                FOR (i:interest) REQUIRE i.id IS UNIQUE
                """;

            String createUniqueConstraintUserIdCypher = """
                CREATE CONSTRAINT user_profile_user_id_unique IF NOT EXISTS
                FOR (u:user_profile) REQUIRE u.user_id IS UNIQUE
                """;

            String createUniqueConstraintIntroduceUserIdCypher = """
                CREATE CONSTRAINT user_profile_introduce_user_id_unique IF NOT EXISTS
                FOR (u:user_profile_introduce) REQUIRE u.user_id IS UNIQUE
                """;

            String createUniqueConstraintPrivacyUserIdCypher = """
                CREATE CONSTRAINT user_profile_privacy_user_id_unique IF NOT EXISTS
                FOR (u:user_profile_privacy) REQUIRE u.user_id IS UNIQUE
                """;

            String createInterestTitleIndexCypher = """
                CREATE INDEX interest_title_idx IF NOT EXISTS
                FOR (i:interest) ON (i.title)
                """;

            String createInterestColorIndexCypher = """
                CREATE INDEX interest_color_idx IF NOT EXISTS
                FOR (i:interest) ON (i.color)
                """;

            session.executeWrite(ex -> {
                ex.run(createUniqueConstraintCypher);
                ex.run(createUniqueConstraintInterestIdCypher);
                ex.run(createUniqueConstraintUserIdCypher);
                ex.run(createUniqueConstraintIntroduceUserIdCypher);
                ex.run(createUniqueConstraintPrivacyUserIdCypher);
                ex.run(createInterestTitleIndexCypher);
                ex.run(createInterestColorIndexCypher);
                return null;
            });

            log.info("Neo4j constraints and indexes initialized successfully");
        } catch (DatabaseException e) {
            log.error("Failed to initialize Neo4j constraints: {}", e.getMessage(), e);
        }
    }

    private void loadCsvData(Session session) {
        try {
            String loadProfilesCypher = """
                LOAD CSV WITH HEADERS FROM 'file:///user_profile.csv' AS row

                MERGE (profile:user_profile {id: row.id})
                SET profile.user_id = row.user_id,
                    profile.fullname = row.fullname,
                    profile.followers_count = toInteger(row.followers_count),
                    profile.following_count = toInteger(row.following_count),
                    profile.created_by = row.created_by,
                    profile.bio = row.bio,
                    profile.last_online_at = datetime(row.last_online_at),
                    profile.modified_by = row.modified_by,
                    profile.created_date = datetime(row.created_date),
                    profile.modified_date = datetime(row.created_date)

                MERGE (introduce:user_profile_introduce {id: row.id})
                SET introduce.user_id = row.user_id,
                    introduce.city = row.city,
                    introduce.hometown = row.hometown,
                    introduce.job_title = row.job_title,
                    introduce.company = row.company,
                    introduce.school = row.school,
                    introduce.website_url = row.website_url,
                    introduce.github_url = row.github_url,
                    introduce.linkedin_url = row.linkedin_url,
                    introduce.x_url = row.x_url,
                    introduce.instagram_url = row.instagram_url,
                    introduce.tiktok_url = row.tiktok_url,
                    introduce.facebook_url = row.facebook_url,
                    introduce.dob = date(row.dob),
                    introduce.gender = row.gender,
                    introduce.relationship_status = row.relationship_status,
                    introduce.phone_number = row.phone_number,
                    introduce.created_by = row.created_by,
                    introduce.modified_by = row.modified_by,
                    introduce.created_date = datetime(row.created_date),
                    introduce.modified_date = datetime(row.created_date)

                MERGE (privacy:user_profile_privacy {id: row.id})
                SET privacy.user_id = row.user_id,
                    privacy.profile_visibility = row.profile_visibility,
                    privacy.friends_visibility = row.friends_visibility,
                    privacy.posts_visibility = row.posts_visibility,
                    privacy.introduce_visibility = row.introduce_visibility,
                    privacy.gallery_visibility = row.gallery_visibility,
                    privacy.created_by = row.created_by,
                    privacy.modified_by = row.modified_by,
                    privacy.created_date = datetime(row.created_date),
                    privacy.modified_date = datetime(row.created_date)

                MERGE (profile)-[:HAS_INTRODUCE]->(introduce)
                MERGE (profile)-[:HAS_PRIVACY]->(privacy)
                """;

            String loadInterestsCypher = """
                LOAD CSV WITH HEADERS FROM 'file:///interests.csv' AS row

                MERGE (interest:interest {id: row.id})
                ON CREATE SET interest.code = toLower(trim(row.code)),
                    interest.title = row.title,
                    interest.color = row.color,
                    interest.created_by = row.created_by,
                    interest.created_date = datetime(row.created_date),
                    interest.modified_by = row.modified_by,
                    interest.modified_date = datetime(row.modified_date)
                ON MATCH SET interest.code = toLower(trim(row.code)),
                    interest.title = row.title,
                    interest.color = row.color,
                    interest.modified_by = row.modified_by,
                    interest.modified_date = datetime(row.modified_date)
                """;

            String loadUserInterestsCypher = """
                LOAD CSV WITH HEADERS FROM 'file:///user_interests.csv' AS row

                MATCH (introduce:user_profile_introduce {id: row.user_profile_introduce_id})
                MATCH (interest:interest {id: row.interest_id})
                MERGE (introduce)-[:INTERESTED_IN]->(interest)
                """;

            session.executeWrite(ex -> {
                ex.run(loadProfilesCypher);
                ex.run(loadInterestsCypher);
                ex.run(loadUserInterestsCypher);
                return null;
            });

            log.info("CSV data loaded successfully");
        } catch (DatabaseException e) {
            log.error("Failed to load CSV data: {}", e.getMessage(), e);
        }
    }
}
