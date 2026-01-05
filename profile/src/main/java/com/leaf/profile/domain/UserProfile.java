package com.leaf.profile.domain;

import java.time.Instant;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

@Getter
@Setter
@Node("user_profile")
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
public class UserProfile extends AbstractAuditingNeo4jEntity {

    @Id
    @GeneratedValue(UUIDStringGenerator.class)
    String id;

    @Builder.Default
    @Property("user_id")
    String userId = "";

    @Builder.Default
    String fullname = "";

    @Builder.Default
    String bio = "";

    @Builder.Default
    @Property("cover_url")
    String coverUrl = "";

    @Builder.Default
    @Property("avatar_url")
    String avatarUrl = "";

    @Relationship(type = "HAS_INTRODUCE", direction = Relationship.Direction.OUTGOING)
    UserProfileIntroduce introduce;

    @Relationship(type = "HAS_PRIVACY", direction = Relationship.Direction.OUTGOING)
    UserProfilePrivacy privacy;

    @Builder.Default
    @Property("last_online_at")
    Instant lastOnlineAt = Instant.now();

    @Builder.Default
    @Property("followers_count")
    Long followersCount = 0L;

    @Builder.Default
    @Property("following_count")
    Long followingCount = 0L;
}
