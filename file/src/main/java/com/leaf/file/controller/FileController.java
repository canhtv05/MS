package com.leaf.file.controller;

import com.leaf.common.dto.ResponseObject;
import com.leaf.file.dto.FileResponse;
import com.leaf.file.service.FileService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FileController {

    FileService fileService;

    @GetMapping("/me")
    public ResponseEntity<ResponseObject<List<FileResponse>>> getMyResources(
            @RequestParam(required = false, defaultValue = "1", name = "page") Integer page,
            @RequestParam(required = false, defaultValue = "15", name = "size") Integer size) {
        return ResponseEntity.ok(fileService.getMyResources(page, size));
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<ResponseObject<FileResponse>> getFileById(@PathVariable("fileId") String fileId) {
        return ResponseEntity.ok(ResponseObject.<FileResponse>builder()
                .data(fileService.getFileById(fileId))
                .build());
    }

    @PostMapping(value = "/media/upload", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseObject<FileResponse>> uploadMedia(@RequestPart("files") MultipartFile[] files)
            throws IOException {
        return ResponseEntity.ok(ResponseObject.<FileResponse>builder()
                .data(fileService.upload(files))
                .build());
    }

    @GetMapping("/batch")
    public ResponseEntity<ResponseObject<List<FileResponse>>> getFilesByIds(@RequestParam List<String> ids) {
        return ResponseEntity.ok(ResponseObject.<List<FileResponse>>builder()
                .data(fileService.getFilesByIds(ids))
                .build());
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<ResponseObject<Void>> deleteById(@PathVariable String fileId) {
        return ResponseEntity.ok(ResponseObject.<Void>builder()
                .data(fileService.deleteById(fileId))
                .message("deleted")
                .build());
    }
}
