package com.leaf.post.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
// import com.leaf.common.domain.UserProfile;
import com.leaf.post.enums.PostStatus;
import com.leaf.post.enums.Visibility;
// import java.util.HashSet;
// import java.util.Set;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.neo4j.core.schema.*;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

@Getter
@Setter
@Node("post")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Post extends AbstractAuditingNeo4jEntity {

    @Id
    @GeneratedValue(UUIDStringGenerator.class)
    String id;

    @Property("content")
    String content;

    @Builder.Default
    Visibility visibility = Visibility.PUBLIC;

    @Builder.Default
    PostStatus status = PostStatus.ACTIVE;

    // @JsonIgnore
    // @Relationship(type = "CREATED_BY", direction =
    // Relationship.Direction.OUTGOING)
    // UserProfile author;

    // @JsonIgnore
    // @Builder.Default
    // @Relationship(type = "LIKED_BY", direction = Relationship.Direction.INCOMING)
    // Set<UserProfile> likedBy = new HashSet<>();

    @JsonIgnore
    @Relationship(type = "SHARED_FROM", direction = Relationship.Direction.OUTGOING)
    Post sharedFrom;
}
