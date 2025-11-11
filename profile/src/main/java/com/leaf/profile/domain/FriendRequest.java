package com.leaf.profile.domain;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.RelationshipId;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.leaf.common.domain.AbstractAuditingEntity;
import com.leaf.common.utils.json.InstantToStringSerializer;
import com.leaf.profile.enums.FriendRequestStatus;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@RelationshipProperties
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class FriendRequest extends AbstractAuditingEntity {

    @RelationshipId
    Long id;

    @Builder.Default
    @Property("send_at")
    @JsonSerialize(using = InstantToStringSerializer.class)
    Instant sendAt = Instant.now();

    @TargetNode
    UserProfile receiver;

    FriendRequestStatus status;
}
