package com.leaf.file.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.leaf.common.grpc.ResourceType;
import com.leaf.file.domain.File;
import java.io.Serial;
import java.io.Serializable;
import java.util.List;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.beans.BeanUtils;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FileResponse implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String id;
    private String ownerId;
    private Long totalSize;

    private List<VideoResponse> videos;
    private List<ImageResponse> images;
    private ResourceType resourceType;

    public static FileResponse toFileResponse(File file) {
        FileResponse fileResponse = new FileResponse();
        BeanUtils.copyProperties(file, fileResponse);
        return fileResponse;
    }
}
