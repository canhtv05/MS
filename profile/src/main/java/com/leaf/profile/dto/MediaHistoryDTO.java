package com.leaf.profile.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.leaf.common.utils.json.InstantToStringSerializer;
import com.leaf.profile.domain.MediaHistory;
import java.time.Instant;
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
public class MediaHistoryDTO {

    String id;
    String userId;
    String url;
    String type;

    @JsonSerialize(using = InstantToStringSerializer.class)
    Instant createdAt;

    public static MediaHistoryDTO toMediaHistoryDTO(MediaHistory mediaHistory) {
        return MediaHistoryDTO.builder()
            .id(mediaHistory.getId())
            .userId(mediaHistory.getUserId())
            .url(mediaHistory.getUrl())
            .type(mediaHistory.getType())
            .createdAt(mediaHistory.getCreatedAt())
            .build();
    }
}
