package com.canhtv05.file.service;

import com.canhtv05.file.dto.ApiResponse;
import com.canhtv05.file.dto.res.FileResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FileService {

    FileResponse upload(MultipartFile[] files) throws IOException;

    ApiResponse<List<FileResponse>> getMyResources(Integer page, Integer size);

    FileResponse getFileById(String id);

    List<FileResponse> getFilesByIds(List<String> ids);

    Void deleteById(String userId);
}
