package com.leaf.common.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PageResponse implements Serializable {

    int currentPage;
    int totalPages;
    int size;
    int count;
    long total;
}
