package com.leaf.file.dto;

import static lombok.AccessLevel.PRIVATE;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.leaf.file.domain.File;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import org.springframework.beans.BeanUtils;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = PRIVATE)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class FileResponse {

    String id;
    String ownerId;
    Long totalSize;

    List<VideoResponse> videos;
    List<ImageResponse> images;

    public static FileResponse toFileResponse(File file) {
        FileResponse fileResponse = new FileResponse();
        BeanUtils.copyProperties(file, fileResponse);
        return fileResponse;
    }
}
