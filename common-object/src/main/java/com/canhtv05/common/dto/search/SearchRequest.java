package com.canhtv05.common.dto.search;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.lang.NonNull;
import org.springframework.util.StringUtils;

public record SearchRequest(
        String searchText,
        Integer page,
        Integer size,
        @NonNull String sortOrder,
        String sortField) {
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
}
