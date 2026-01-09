package com.leaf.file.dto;

import java.io.Serializable;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MediaHistoryGroupDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    String date;
    List<ImageResponse> items;
}
