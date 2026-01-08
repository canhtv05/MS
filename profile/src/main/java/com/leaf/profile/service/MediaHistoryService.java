package com.leaf.profile.service;

import com.leaf.common.dto.PageResponse;
import com.leaf.common.dto.search.SearchRequest;
import com.leaf.common.dto.search.SearchResponse;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.framework.security.SecurityUtils;
import com.leaf.profile.domain.MediaHistory;
import com.leaf.profile.dto.MediaHistoryDTO;
import com.leaf.profile.dto.MediaHistoryGroupDTO;
import com.leaf.profile.repository.MediaHistoryRepository;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MediaHistoryService {

    MediaHistoryRepository mediaHistoryRepository;

    public SearchResponse<MediaHistoryGroupDTO> searchMediaHistory(SearchRequest searchRequest) {
        String username = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new ApiException(ErrorMessage.UNAUTHENTICATED)
        );

        Pageable pageable;
        Page<MediaHistory> page;
        if (StringUtils.isNotBlank(searchRequest.searchText())) {
            pageable = searchRequest.toPageable();
            page = mediaHistoryRepository.searchByUserIdAndText(username, searchRequest.searchText(), pageable);
        } else {
            pageable = searchRequest.toPageable(Sort.Direction.DESC, "createdAt");
            page = mediaHistoryRepository.findByUserId(username, pageable);
        }
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy").withZone(ZoneId.systemDefault());

        Map<String, List<MediaHistoryDTO>> groupedByDate = page
            .getContent()
            .stream()
            .collect(
                Collectors.groupingBy(
                    media -> dateFormatter.format(media.getCreatedAt()),
                    LinkedHashMap::new,
                    Collectors.mapping(MediaHistoryDTO::toMediaHistoryDTO, Collectors.toList())
                )
            );

        List<MediaHistoryGroupDTO> groupedResult = groupedByDate
            .entrySet()
            .stream()
            .map(entry -> MediaHistoryGroupDTO.builder().date(entry.getKey()).items(entry.getValue()).build())
            .toList();

        PageResponse pageResponse = PageResponse.builder()
            .currentPage(page.getNumber() + 1)
            .totalPages(page.getTotalPages())
            .size(page.getSize())
            .count(page.getNumberOfElements())
            .total(page.getTotalElements())
            .build();
        return new SearchResponse<>(groupedResult, pageResponse);
    }
}
