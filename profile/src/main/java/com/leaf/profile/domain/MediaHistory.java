package com.leaf.profile.domain;

import java.time.Instant;
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
@AllArgsConstructor
@NoArgsConstructor
@Node("media_history")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class MediaHistory {

    @Id
    @GeneratedValue(UUIDStringGenerator.class)
    String id;

    @Builder.Default
    @Property("user_id")
    String userId = "";

    @Builder.Default
    @Property("url")
    String url = "";

    @Builder.Default
    @Property("type")
    String type = "";

    @Builder.Default
    @Property("created_at")
    Instant createdAt = Instant.now();
}
