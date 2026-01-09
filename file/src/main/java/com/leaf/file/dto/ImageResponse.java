package com.leaf.file.dto;

import com.leaf.common.grpc.ResourceType;
import com.leaf.file.domain.Image;
import java.io.Serializable;
import java.time.Instant;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.BeanUtils;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImageResponse implements Serializable {

    String contentType;
    String imageUrl;
    Long fileSize;
    String originFileName;
    String publicId;
    Instant createdAt;
    ResourceType resourceType;

    public static ImageResponse toImageResponse(Image file) {
        ImageResponse imageResponse = new ImageResponse();
        BeanUtils.copyProperties(file, imageResponse);
        if (file.getCreatedAt() != null) {
            imageResponse.setCreatedAt(file.getCreatedAt());
        }
        imageResponse.setResourceType(file.getResourceType());
        return imageResponse;
    }
}
