package com.leaf.profile.domain;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

@Getter
@Setter
@Builder
@Node("interest")
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
public class Interest {

    @Id
    @GeneratedValue(UUIDStringGenerator.class)
    String id;

    @Builder.Default
    String title = "";

    @Builder.Default
    String color = "";
}
