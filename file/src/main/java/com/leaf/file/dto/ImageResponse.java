package com.leaf.file.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

import org.springframework.beans.BeanUtils;

import com.leaf.file.domain.Image;

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

    public static ImageResponse toEmImageResponse(Image file) {
        ImageResponse imageResponse = new ImageResponse();
        BeanUtils.copyProperties(file, imageResponse);
        return imageResponse;
    }
}