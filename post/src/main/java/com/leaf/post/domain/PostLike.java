package com.leaf.post.domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
// import com.leaf.common.domain.;
import com.leaf.common.utils.json.InstantToStringSerializer;
import java.time.Instant;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.neo4j.core.schema.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RelationshipProperties
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostLike {

    @RelationshipId
    String id;

    @Builder.Default
    @Property("liked_at")
    @JsonSerialize(using = InstantToStringSerializer.class)
    Instant likedAt = Instant.now();

    // @TargetNode
    // UserProfile user;
}
