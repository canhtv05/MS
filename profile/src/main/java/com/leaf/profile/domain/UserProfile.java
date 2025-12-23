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

    @Property("user_id")
    String userId;

    String fullname;
    LocalDate dob;
    String city;
    Gender gender;
    String bio;

    @Property("phone_number")
    String phoneNumber;

    @Property("cover_url")
    String coverUrl;

    @Property("avatar_url")
    String avatarUrl;

    @Property("x_url")
    String xUrl;

    @Property("instagram_url")
    String instagramUrl;

    @Property("tiktok_url")
    String tiktokUrl;

    @Property("facebook_url")
    String facebookUrl;

    @Property("profile_visibility")
    PrivacyLevel profileVisibility;

    @Property("friends_visibility")
    PrivacyLevel friendsVisibility;

    @Property("posts_visibility")
    PrivacyLevel postsVisibility;

    @Property("last_online_at")
    Instant lastOnlineAt;

    @Property("followers_count")
    @Builder.Default
    Long followersCount = 0L;

    @Property("following_count")
    @Builder.Default
    Long followingCount = 0L;
}
