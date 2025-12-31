package com.leaf.profile.controller;

import com.leaf.common.dto.ResponseObject;
import com.leaf.common.dto.search.SearchRequest;
import com.leaf.common.dto.search.SearchResponse;
import com.leaf.profile.dto.MediaHistoryGroupDTO;
import com.leaf.profile.service.MediaHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MediaHistoryController {

    private final MediaHistoryService mediaHistoryService;

    @PostMapping("/me/search-media-history")
    public ResponseEntity<ResponseObject<SearchResponse<MediaHistoryGroupDTO>>> searchMediaHistory(
        @ModelAttribute SearchRequest criteria
    ) {
        return ResponseEntity.ok(ResponseObject.success(mediaHistoryService.searchMediaHistory(criteria)));
    }
}
