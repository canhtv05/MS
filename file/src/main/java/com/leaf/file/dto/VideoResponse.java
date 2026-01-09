package com.leaf.file.dto;

import com.leaf.common.grpc.ResourceType;
import com.leaf.file.domain.Video;
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
public class VideoResponse implements Serializable {

    Double playtimeSeconds;
    String playtimeString;
    String contentType;
    String videoUrl;
    String thumbnailUrl;
    String previewVttUrl;
    Long fileSize;
    String originFileName;
    String publicId;
    Instant createdAt;
    ResourceType resourceType;

    public static VideoResponse tVideoResponse(Video file) {
        VideoResponse videoResponse = new VideoResponse();
        BeanUtils.copyProperties(file, videoResponse);
        if (file.getCreatedAt() != null) {
            videoResponse.setCreatedAt(file.getCreatedAt());
        }
        videoResponse.setResourceType(file.getResourceType());
        return videoResponse;
    }
}
