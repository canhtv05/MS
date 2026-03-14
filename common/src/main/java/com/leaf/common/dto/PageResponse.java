package com.leaf.common.dto;

import java.io.Serializable;
import lombok.*;
import lombok.experimental.FieldDefaults;

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

    public static PageResponse empty() {
        return PageResponse.builder().currentPage(0).totalPages(0).size(0).count(0).total(0).build();
    }
}
