package com.leaf.profile.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.neo4j.core.schema.Property;

@Setter
@Getter
@SuperBuilder
@NoArgsConstructor
@JsonIgnoreProperties(value = { "createdBy", "createdDate", "modifiedBy", "modifiedDate" }, allowGetters = true)
public abstract class AbstractAuditingNeo4jEntity implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @CreatedBy
    @Property("created_by")
    private String createdBy;

    @CreatedDate
    @Property("created_date")
    @Builder.Default
    private Instant createdDate = Instant.now();

    @LastModifiedBy
    @Property("modified_by")
    private String modifiedBy;

    @LastModifiedDate
    @Property("modified_date")
    @Builder.Default
    private Instant modifiedDate = Instant.now();
}
