package com.canhtv05.file.dto.res;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

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
}