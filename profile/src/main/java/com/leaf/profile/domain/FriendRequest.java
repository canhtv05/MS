package com.leaf.profile.domain;

import lombok.*;
import lombok.experimental.FieldDefaults;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

import com.leaf.common.domain.AbstractAuditingEntity;
import com.leaf.profile.enums.FriendRequestStatus;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@RelationshipProperties
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class FriendRequest extends AbstractAuditingEntity {

    @Id
    @GeneratedValue
    Long id;

    @TargetNode
    UserProfile receiver;

    FriendRequestStatus status;
}
