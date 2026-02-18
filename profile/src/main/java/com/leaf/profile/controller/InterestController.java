package com.leaf.profile.controller;

import com.leaf.common.dto.ResponseObject;
import com.leaf.common.dto.search.SearchRequest;
import com.leaf.common.dto.search.SearchResponse;
import com.leaf.profile.dto.InterestDTO;
import com.leaf.profile.dto.req.CreateInterestReq;
import com.leaf.profile.service.InterestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class InterestController {

    private final InterestService interestService;

    @GetMapping("/interests")
    public ResponseEntity<ResponseObject<SearchResponse<InterestDTO>>> searchData(
        @ModelAttribute SearchRequest searchRequest
    ) {
        return ResponseEntity.ok(ResponseObject.success(interestService.searchData(searchRequest)));
    }

    @PostMapping("/interests")
    public ResponseEntity<ResponseObject<InterestDTO>> createInterest(@Valid @RequestBody CreateInterestReq req) {
        return ResponseEntity.ok(ResponseObject.success(interestService.createInterest(req)));
    }
}
