package com.leaf.file.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.leaf.common.grpc.ResourceType;
import com.leaf.common.utils.json.InstantToStringSerializer;
import com.leaf.file.domain.Video;
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
public class VideoResponse implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Double playtimeSeconds;
    private String playtimeString;
    private String contentType;
    private String videoUrl;
    private String thumbnailUrl;
    private String previewVttUrl;
    private Long fileSize;
    private String originFileName;
    private String publicId;

    @JsonSerialize(using = InstantToStringSerializer.class)
    private Instant createdAt;

    private ResourceType resourceType;

    public static VideoResponse toVideoResponse(Video file) {
        VideoResponse videoResponse = new VideoResponse();
        BeanUtils.copyProperties(file, videoResponse);
        if (file.getCreatedAt() != null) {
            videoResponse.setCreatedAt(file.getCreatedAt());
        }
        videoResponse.setResourceType(file.getResourceType());
        return videoResponse;
    }
}
