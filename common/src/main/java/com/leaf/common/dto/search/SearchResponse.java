package com.leaf.common.dto.search;

import com.leaf.common.dto.PageResponse;
import java.util.List;

public record SearchResponse<T>(List<T> data, PageResponse pagination) {
    public static <T> SearchResponse<T> of(List<T> data, PageResponse pagination) {
        return new SearchResponse<>(data, pagination);
    }

    public static <T> SearchResponse<T> empty() {
        return new SearchResponse<>(List.of(), PageResponse.empty());
    }

    public static <T> SearchResponse<T> of(List<T> data) {
        return new SearchResponse<>(data, PageResponse.empty());
    }
}
