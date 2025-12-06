package com.leaf.profile.domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.leaf.common.utils.json.InstantToStringSerializer;
import com.leaf.profile.enums.FriendRequestStatus;
import java.time.Instant;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.RelationshipId;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@RelationshipProperties
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class FriendRequest {

    @RelationshipId
    String id;

    @Builder.Default
    @Property("send_at")
    @JsonSerialize(using = InstantToStringSerializer.class)
    Instant sendAt = Instant.now();

    @TargetNode
    UserProfile receiver;

    FriendRequestStatus status;
}
