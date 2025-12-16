package com.leaf.file.dto;

import com.leaf.file.domain.Video;
import java.io.Serializable;
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

    public static VideoResponse tVideoResponse(Video file) {
        VideoResponse videoResponse = new VideoResponse();
        BeanUtils.copyProperties(file, videoResponse);
        return videoResponse;
    }
}
