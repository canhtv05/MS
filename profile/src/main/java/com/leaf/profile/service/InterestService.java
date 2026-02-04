package com.leaf.profile.service;

import com.leaf.common.dto.PageResponse;
import com.leaf.common.dto.search.SearchRequest;
import com.leaf.common.dto.search.SearchResponse;
import com.leaf.profile.domain.Interest;
import com.leaf.profile.dto.InterestDTO;
import com.leaf.profile.repository.InterestRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InterestService {

    InterestRepository interestRepository;

    public SearchResponse<InterestDTO> searchData(SearchRequest searchRequest) {
        Page<Interest> pageInterest = interestRepository.findAll(searchRequest.toPageable());
        var content = pageInterest.stream().map(InterestDTO::toInterestDTO).toList();
        PageResponse pageResponse = PageResponse.builder()
            .currentPage(searchRequest.page() + 1)
            .size(searchRequest.size())
            .total(pageInterest.getTotalElements())
            .totalPages(pageInterest.getTotalPages())
            .count(content.size())
            .build();
        return new SearchResponse<>(content, pageResponse);
    }

    // private Specification // search title nữa
}
