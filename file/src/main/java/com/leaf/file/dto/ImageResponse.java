package com.leaf.file.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.leaf.common.grpc.ResourceType;
import com.leaf.common.utils.json.InstantToStringSerializer;
import com.leaf.file.domain.Image;
import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import lombok.*;
import org.springframework.beans.BeanUtils;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ImageResponse implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String contentType;
    private String imageUrl;
    private Long fileSize;
    private String originFileName;
    private String publicId;

    @JsonSerialize(using = InstantToStringSerializer.class)
    private Instant createdAt;

    private ResourceType resourceType;

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
