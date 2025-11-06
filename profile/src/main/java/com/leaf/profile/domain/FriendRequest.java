package com.leaf.profile.domain;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import com.leaf.common.domain.AbstractAuditingEntity;
import com.leaf.profile.enums.FriendRequestStatus;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Node("friend_request")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class FriendRequest extends AbstractAuditingEntity {

    @Relationship(type = "SENDER", direction = Relationship.Direction.INCOMING)
    UserProfile sender;

    @Relationship(type = "RECEIVER", direction = Relationship.Direction.INCOMING)
    UserProfile receiver;

    FriendRequestStatus status;
}
