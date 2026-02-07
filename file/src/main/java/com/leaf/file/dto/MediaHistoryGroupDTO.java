package com.leaf.file.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.io.Serial;
import java.io.Serializable;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MediaHistoryGroupDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String date;
    private List<ImageResponse> items;
}
