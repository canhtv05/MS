package com.leaf.profile.domain;

import com.leaf.common.grpc.Gender;
import com.leaf.common.grpc.PrivacyLevel;
import java.time.Instant;
import java.time.LocalDate;
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
    LocalDate dob = null;

    @Builder.Default
    String city = "";

    @Builder.Default
    Gender gender = null;

    @Builder.Default
    String bio = "";

    @Builder.Default
    @Property("phone_number")
    String phoneNumber = "";

    @Builder.Default
    @Property("cover_url")
    String coverUrl = "";

    @Builder.Default
    @Property("avatar_url")
    String avatarUrl = "";

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
    @Property("profile_visibility")
    PrivacyLevel profileVisibility = PrivacyLevel.PUBLIC;

    @Builder.Default
    @Property("friends_visibility")
    PrivacyLevel friendsVisibility = PrivacyLevel.PUBLIC;

    @Builder.Default
    @Property("posts_visibility")
    PrivacyLevel postsVisibility = PrivacyLevel.PUBLIC;

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
