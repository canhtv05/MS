package com.leaf.file.domain;

import com.leaf.common.grpc.ResourceType;
import java.time.Instant;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Document(collection = "files")
public class Image {

    String contentType;
    String imageUrl;
    Long fileSize;
    String originFileName;
    String publicId;
    Instant createdAt;
    ResourceType resourceType;
}
