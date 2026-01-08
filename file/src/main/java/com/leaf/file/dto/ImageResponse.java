package com.leaf.file.dto;

import com.leaf.file.domain.Image;
import java.io.Serializable;
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

    public static ImageResponse toImageResponse(Image file) {
        ImageResponse imageResponse = new ImageResponse();
        BeanUtils.copyProperties(file, imageResponse);
        return imageResponse;
    }
}
