package com.leaf.graphql_bff.profile.dto;

import com.leaf.common.grpc.ResourceType;
import java.io.Serializable;
import java.time.OffsetDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImageDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    String contentType;
    String imageUrl;
    Long fileSize;
    String originFileName;
    String publicId;
    OffsetDateTime createdAt;
    ResourceType resourceType;
}
