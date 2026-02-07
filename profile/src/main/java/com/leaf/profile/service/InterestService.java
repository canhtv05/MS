package com.leaf.profile.service;

import com.leaf.common.dto.PageResponse;
import com.leaf.common.dto.search.SearchRequest;
import com.leaf.common.dto.search.SearchResponse;
import com.leaf.profile.domain.Interest;
import com.leaf.profile.dto.InterestDTO;
import com.leaf.profile.repository.InterestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
public class InterestService {

    private final InterestRepository interestRepository;

    @Transactional(readOnly = true)
    public SearchResponse<InterestDTO> searchData(SearchRequest searchRequest) {
        Page<Interest> pageInterest = interestRepository.findAll(
            searchRequest.searchText(),
            searchRequest.toPageable()
        );
        var content = pageInterest.stream().map(InterestDTO::toInterestDTO).toList();
        PageResponse pageResponse = PageResponse.builder()
            .currentPage(searchRequest.page())
            .size(searchRequest.size())
            .total(pageInterest.getTotalElements())
            .totalPages(pageInterest.getTotalPages())
            .count(content.size())
            .build();
        return new SearchResponse<>(content, pageResponse);
    }
}
