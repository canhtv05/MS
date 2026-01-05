package com.leaf.profile.domain;

import com.leaf.common.grpc.Gender;
import com.leaf.common.grpc.RelationshipStatus;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

@Getter
@Setter
@Node("user_profile_introduce")
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileIntroduce extends AbstractAuditingNeo4jEntity {

    @Id
    @GeneratedValue(UUIDStringGenerator.class)
    String id;

    @Builder.Default
    String city = "";

    @Builder.Default
    String hometown = "";

    @Builder.Default
    @Property("job_title")
    String jobTitle = "";

    @Builder.Default
    String company = "";

    @Builder.Default
    String school = "";

    @Builder.Default
    @Property("website_url")
    String websiteUrl = "";

    @Builder.Default
    @Property("github_url")
    String githubUrl = "";

    @Builder.Default
    @Property("linkedin_url")
    String linkedinUrl = "";

    @Builder.Default
    @Property("x_url")
    String xUrl = "";

    @Builder.Default
    @Property("instagram_url")
    String instagramUrl = "";

    @Builder.Default
    @Property("tiktok_url")
    String tiktokUrl = "";

    @Builder.Default
    @Property("facebook_url")
    String facebookUrl = "";

    @Builder.Default
    LocalDate dob = null;

    @Builder.Default
    Gender gender = Gender.GENDER_UNSPECIFIED;

    @Builder.Default
    @Property("relationship_status")
    RelationshipStatus relationshipStatus = RelationshipStatus.RELATIONSHIP_STATUS_SINGLE;

    @Builder.Default
    @Property("phone_number")
    String phoneNumber = "";

    @Builder.Default
    List<String> interests = new ArrayList<>();
}
