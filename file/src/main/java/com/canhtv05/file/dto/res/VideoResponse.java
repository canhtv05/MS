package com.canhtv05.file.dto.res;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

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
}
