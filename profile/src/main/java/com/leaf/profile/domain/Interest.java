package com.leaf.profile.domain;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

@Getter
@Setter
@SuperBuilder
@Node("interest")
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
public class Interest extends AbstractAuditingNeo4jEntity {

    @Id
    @GeneratedValue(UUIDStringGenerator.class)
    String id;

    @Builder.Default
    String code = "";

    @Builder.Default
    String title = "";

    @Builder.Default
    String color = "";
}
