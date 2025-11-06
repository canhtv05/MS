package com.leaf.file.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

import org.springframework.beans.BeanUtils;

import com.leaf.file.domain.Video;

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
    Long fileSize;
    String originFileName;
    String publicId;

    public static VideoResponse tVideoResponse(Video file) {
        VideoResponse videoResponse = new VideoResponse();
        BeanUtils.copyProperties(file, videoResponse);
        return videoResponse;
    }
}
