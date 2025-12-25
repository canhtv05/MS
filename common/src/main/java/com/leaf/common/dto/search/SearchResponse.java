package com.leaf.common.dto.search;

import com.leaf.common.dto.PageResponse;
import java.util.List;

public record SearchResponse<T>(List<T> data, PageResponse pagination) {}
