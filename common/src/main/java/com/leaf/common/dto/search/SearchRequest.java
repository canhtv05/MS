package com.leaf.common.dto.search;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.lang.NonNull;
import org.springframework.util.StringUtils;

public record SearchRequest(
    @JsonProperty("searchText") String searchText,
    @JsonProperty("page") Integer page,
    @JsonProperty("size") Integer size,
    @JsonProperty("sortOrder") @NonNull String sortOrder,
    @JsonProperty("sortField") String sortField
) {
    public Pageable toPageable() {
        int safePage = (page == null || page < 1) ? 0 : page - 1;
        int safeSize = (size == null || size < 1) ? 20 : size;
        if (StringUtils.hasText(sortField) && StringUtils.hasText(sortOrder)) {
            return PageRequest.of(safePage, safeSize, Sort.Direction.fromString(sortOrder), sortField);
        }
        return PageRequest.of(safePage, safeSize);
    }

    public Pageable toPageable(Sort.Direction sort, String sortDefault) {
        int safePage = (page == null || page < 1) ? 0 : page - 1;
        int safeSize = (size == null || size < 1) ? 20 : size;
        if (StringUtils.hasText(sortField) && StringUtils.hasText(sortOrder)) {
            return PageRequest.of(safePage, safeSize, Sort.Direction.fromString(sortOrder), sortField);
        }
        if (sort != null && StringUtils.hasText(sortDefault)) {
            return PageRequest.of(safePage, safeSize, sort, sortDefault);
        }
        return PageRequest.of(safePage, safeSize);
    }

    public static SearchRequest of(String searchText, Integer page, Integer size, String sortOrder, String sortField) {
        return new SearchRequest(searchText, page, size, sortOrder, sortField);
    }

    public static SearchRequest of(Integer page, Integer size) {
        return new SearchRequest(null, page, size, null, null);
    }

    public long getSkip() {
        return (long) (page == null || page < 1 ? 0 : page - 1) * (size == null || size < 1 ? 20 : size);
    }

    public int getLimit() {
        return size == null || size < 1 ? 20 : size;
    }
}
