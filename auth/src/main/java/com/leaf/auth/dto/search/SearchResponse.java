package com.leaf.auth.dto.search;

import java.util.List;

public record SearchResponse<T>(List<T> data, Long totalCount) {}
