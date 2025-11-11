package com.leaf.profile.domain;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.Relationship;

import com.leaf.common.domain.AbstractAuditingEntity;
import com.leaf.profile.enums.Gender;
import com.leaf.profile.enums.PrivacyLevel;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Node("user_profile")
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
public class UserProfile extends AbstractAuditingEntity {

    @Id
    @GeneratedValue
    Long id;

    @Property("user_id")
    String userId;
    String username;
    String email;
    LocalDate dob;
    String city;
    Gender gender;
    String bio;

    @Property("cover_url")
    String coverUrl;

    @Property("phone_number")
    String phoneNumber;

    @Property("avatar_url")
    String avatarUrl;

    @Property("social_links")
    @Builder.Default
    List<String> socialLinks = new ArrayList<>();

    @Property("profile_visibility")
    @Builder.Default
    PrivacyLevel profileVisibility = PrivacyLevel.PUBLIC;

    @Property("friends_visibility")
    @Builder.Default
    PrivacyLevel friendsVisibility = PrivacyLevel.PUBLIC;

    @Property("posts_visibility")
    @Builder.Default
    PrivacyLevel postsVisibility = PrivacyLevel.PUBLIC;

    @Property("last_online_at")
    Instant lastOnlineAt;

    @Property("followers_count")
    @Builder.Default
    Long followersCount = 0L;

    @Property("following_count")
    @Builder.Default
    Long followingCount = 0L;

    @Builder.Default
    @Relationship(type = "FRIEND_REQUESTS", direction = Relationship.Direction.OUTGOING)
    Set<FriendRequest> friendRequests = new HashSet<>();

    @Builder.Default
    @Relationship(type = "FRIENDS")
    Set<UserProfile> friends = new HashSet<>();

    @Builder.Default
    @Relationship(type = "FOLLOWING", direction = Relationship.Direction.OUTGOING)
    Set<UserProfile> following = new HashSet<>();

    @Builder.Default
    @Relationship(type = "FOLLOWS", direction = Relationship.Direction.INCOMING)
    Set<UserProfile> followers = new HashSet<>();
}
