package com.canhtv05.file.dto.res;

import com.canhtv05.file.dto.AbstractResponse;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.List;

import static lombok.AccessLevel.PRIVATE;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = PRIVATE)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
@EqualsAndHashCode(callSuper = true)
public class FileResponse extends AbstractResponse {

    String ownerId;
    Long totalSize;

    List<VideoResponse> videos;
    List<ImageResponse> images;
}
