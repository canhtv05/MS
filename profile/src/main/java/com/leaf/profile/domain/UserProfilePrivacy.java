package com.leaf.profile.domain;

import com.leaf.common.grpc.PrivacyLevelGrpc;
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
@Node("user_profile_privacy")
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
public class UserProfilePrivacy extends AbstractAuditingNeo4jEntity {

    @Id
    @GeneratedValue(UUIDStringGenerator.class)
    String id;

    @Builder.Default
    @Property("user_id")
    String userId = "";

    @Builder.Default
    @Property("profile_visibility")
    PrivacyLevelGrpc profileVisibility = PrivacyLevelGrpc.PRIVACY_LEVEL_PUBLIC;

    @Builder.Default
    @Property("friends_visibility")
    PrivacyLevelGrpc friendsVisibility = PrivacyLevelGrpc.PRIVACY_LEVEL_PUBLIC;

    @Builder.Default
    @Property("posts_visibility")
    PrivacyLevelGrpc postsVisibility = PrivacyLevelGrpc.PRIVACY_LEVEL_PUBLIC;

    @Builder.Default
    @Property("introduce_visibility")
    PrivacyLevelGrpc introduceVisibility = PrivacyLevelGrpc.PRIVACY_LEVEL_PUBLIC;

    @Builder.Default
    @Property("gallery_visibility")
    PrivacyLevelGrpc galleryVisibility = PrivacyLevelGrpc.PRIVACY_LEVEL_PUBLIC;
}
