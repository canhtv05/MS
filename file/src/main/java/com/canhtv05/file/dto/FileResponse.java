package com.canhtv05.file.dto;

import com.canhtv05.file.domain.File;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.List;

import org.springframework.beans.BeanUtils;

import static lombok.AccessLevel.PRIVATE;

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
