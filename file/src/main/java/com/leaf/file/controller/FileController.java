package com.leaf.file.controller;

import com.leaf.common.dto.ResponseObject;
import com.leaf.common.dto.search.SearchRequest;
import com.leaf.common.dto.search.SearchResponse;
import com.leaf.common.grpc.ResourceType;
import com.leaf.file.dto.FileResponse;
import com.leaf.file.dto.MediaHistoryGroupDTO;
import com.leaf.file.service.FileService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @GetMapping("/me")
    public ResponseEntity<ResponseObject<List<FileResponse>>> getMyResources(
        @RequestParam(required = false, defaultValue = "1", name = "page") Integer page,
        @RequestParam(required = false, defaultValue = "15", name = "size") Integer size
    ) {
        return ResponseEntity.ok(fileService.getMyResources(page, size));
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<ResponseObject<FileResponse>> getFileById(@PathVariable("fileId") String fileId) {
        return ResponseEntity.ok(ResponseObject.<FileResponse>builder().data(fileService.getFileById(fileId)).build());
    }

    @GetMapping("/batch")
    public ResponseEntity<ResponseObject<List<FileResponse>>> getFilesByIds(@RequestParam List<String> ids) {
        return ResponseEntity.ok(
            ResponseObject.<List<FileResponse>>builder().data(fileService.getFilesByIds(ids)).build()
        );
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<ResponseObject<Void>> deleteById(@PathVariable String fileId) {
        return ResponseEntity.ok(
            ResponseObject.<Void>builder().data(fileService.deleteById(fileId)).message("deleted").build()
        );
    }

    @PostMapping("/search-media-history")
    public ResponseEntity<ResponseObject<SearchResponse<MediaHistoryGroupDTO>>> searchMediaHistory(
        @ModelAttribute SearchRequest searchRequest,
        @RequestParam List<ResourceType> resourceType
    ) {
        return ResponseEntity.ok(fileService.getUserMediaHistory(searchRequest, resourceType));
    }
}
