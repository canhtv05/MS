package com.leaf.file.service;

import com.leaf.common.dto.PageResponse;
import com.leaf.common.dto.ResponseObject;
import com.leaf.common.dto.search.SearchRequest;
import com.leaf.common.dto.search.SearchResponse;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.grpc.ResourceTypeGrpc;
import com.leaf.common.grpc.SearchGrpcRequest;
import com.leaf.file.domain.File;
import com.leaf.file.domain.Image;
import com.leaf.file.dto.FileResponse;
import com.leaf.file.dto.ImageResponse;
import com.leaf.file.dto.MediaHistoryGroupDTO;
import com.leaf.file.dto.VideoResponse;
import com.leaf.file.repository.FileRepository;
import com.leaf.file.util.FileStorageUtil;
import com.leaf.framework.blocking.service.CommonService;
import com.leaf.framework.blocking.util.CommonUtils;
import java.io.InputStream;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.unit.DataSize;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
public class FileService {

    private final MinioStorageService minioStorageService;
    private final FileRepository fileRepository;
    private final MongoTemplate mongoTemplate;

    @Value("${spring.servlet.multipart.max-file-size}")
    private DataSize maxFileSize;

    @Value("${spring.servlet.multipart.max-request-size}")
    private DataSize maxRequestSize;

    public FileResponse uploadFiles(MultipartFile[] files, ResourceTypeGrpc resourceType) {
        String userId = CommonService.getCurrentUserLogin();
        long totalSize = Arrays.stream(files).mapToLong(MultipartFile::getSize).sum();
        if (totalSize > maxRequestSize.toBytes()) {
            throw new ApiException(ErrorMessage.FILE_SIZE_EXCEEDED);
        }
        List<ImageResponse> images = new ArrayList<>();
        List<VideoResponse> videos = new ArrayList<>();
        for (MultipartFile file : files) {
            String contentType = file.getContentType();
            if (contentType == null) continue;
            if (contentType.startsWith("image")) images.add(uploadOneImage(file, resourceType, userId, true));
            if (contentType.startsWith("video")) videos.add(uploadOneVideo(file, resourceType, userId, true));
        }
        return processFileUpload(userId, totalSize, images, videos, resourceType);
    }

    public ImageResponse uploadOneImage(
        MultipartFile file,
        ResourceTypeGrpc resourceType,
        String userId,
        boolean isUploadMany
    ) {
        validateFileSize(file, isUploadMany);
        String objectKey = FileStorageUtil.generateObjectKey(resourceType, userId, file.getOriginalFilename());
        minioStorageService.putObject(objectKey, file);
        ImageResponse response = ImageResponse.builder()
            .imageUrl(objectKey)
            .contentType(file.getContentType())
            .fileSize(file.getSize())
            .originFileName(file.getOriginalFilename())
            .createdAt(Instant.now())
            .resourceType(resourceType)
            .build();
        if (!isUploadMany) saveSingleImage(userId, response, resourceType);
        fillPresignedUrl(response);
        return response;
    }

    public VideoResponse uploadOneVideo(
        MultipartFile file,
        ResourceTypeGrpc resourceType,
        String userId,
        boolean isUploadMany
    ) {
        validateFileSize(file, isUploadMany);
        String objectKey = FileStorageUtil.generateObjectKey(resourceType, userId, file.getOriginalFilename());
        minioStorageService.putObject(objectKey, file);
        VideoResponse response = VideoResponse.builder()
            .videoUrl(objectKey)
            .contentType(file.getContentType())
            .fileSize(file.getSize())
            .originFileName(file.getOriginalFilename())
            .createdAt(Instant.now())
            .resourceType(resourceType)
            .build();
        if (!isUploadMany) saveSingleVideo(userId, response, resourceType);
        fillPresignedUrl(response);
        return response;
    }

    private void saveSingleImage(String userId, ImageResponse image, ResourceTypeGrpc type) {
        Instant now = Instant.now();
        fileRepository.save(
            File.builder()
                .ownerId(userId)
                .resourceType(type)
                .createdAt(now)
                .updatedAt(now)
                .totalSize(image.getFileSize())
                .images(List.of(ImageResponse.toImage(image)))
                .build()
        );
    }

    private void saveSingleVideo(String userId, VideoResponse video, ResourceTypeGrpc type) {
        Instant now = Instant.now();
        fileRepository.save(
            File.builder()
                .ownerId(userId)
                .resourceType(type)
                .createdAt(now)
                .updatedAt(now)
                .totalSize(video.getFileSize())
                .videos(List.of(VideoResponse.toVideo(video)))
                .build()
        );
    }

    private FileResponse processFileUpload(
        String userId,
        Long totalSize,
        List<ImageResponse> images,
        List<VideoResponse> videos,
        ResourceTypeGrpc resourceType
    ) {
        File entity = File.builder()
            .id(UUID.randomUUID().toString())
            .ownerId(userId)
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .totalSize(totalSize)
            .images(images.stream().map(ImageResponse::toImage).toList())
            .videos(videos.stream().map(VideoResponse::toVideo).toList())
            .resourceType(resourceType)
            .build();
        fileRepository.save(entity);
        FileResponse resp = FileResponse.toFileResponse(entity);
        fillPresignedUrls(resp);
        return resp;
    }

    private void validateFileSize(MultipartFile file, boolean many) {
        if (!many && file.getSize() > maxFileSize.toBytes()) {
            throw new ApiException(ErrorMessage.FILE_SIZE_EXCEEDED);
        }
    }

    public Void deleteById(String fileId) {
        File file = fileRepository.findById(fileId).orElseThrow(() -> new ApiException(ErrorMessage.FILE_NOT_FOUND));
        List<String> objectKeys = new ArrayList<>();
        if (CommonUtils.isNotEmpty(file.getImages())) {
            for (var image : file.getImages()) {
                String key = FileStorageUtil.extractObjectKeyFromUrl(image.getImageUrl());
                if (CommonUtils.isNotEmpty(key)) objectKeys.add(key);
            }
        }
        if (CommonUtils.isNotEmpty(file.getVideos())) {
            for (var video : file.getVideos()) {
                String key = FileStorageUtil.extractObjectKeyFromUrl(video.getVideoUrl());
                if (CommonUtils.isNotEmpty(key)) objectKeys.add(key);
            }
        }
        deleteObjectsParallel(objectKeys);
        fileRepository.delete(file);
        return null;
    }

    private void deleteObjectsParallel(List<String> objectKeys) {
        if (objectKeys.isEmpty()) return;
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            List<Callable<Void>> tasks = objectKeys
                .stream()
                .map(key ->
                    (Callable<Void>) () -> {
                        minioStorageService.removeObject(key);
                        return null;
                    }
                )
                .toList();
            executor.invokeAll(tasks);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("Delete interrupted", e);
        }
    }

    @Transactional(readOnly = true)
    public SearchResponse<ImageResponse> getFileImageByUserIdAndResourceType(
        String userId,
        List<ResourceTypeGrpc> resourceTypes,
        SearchGrpcRequest searchRequest
    ) {
        if (!fileRepository.existsByOwnerId(userId)) {
            return new SearchResponse<>(List.of(), PageResponse.builder().build());
        }
        List<String> typeNames = resourceTypes.stream().map(ResourceTypeGrpc::name).toList();
        List<Integer> typeNumbers = resourceTypes.stream().map(ResourceTypeGrpc::getNumber).toList();
        Criteria criteria = Criteria.where("ownerId")
            .is(userId)
            .orOperator(Criteria.where("resourceType").in(typeNames), Criteria.where("resourceType").in(typeNumbers));

        Aggregation countAgg = Aggregation.newAggregation(
            Aggregation.match(criteria),
            Aggregation.unwind("images"),
            Aggregation.count().as("total")
        );
        Document countResult = mongoTemplate.aggregate(countAgg, "files", Document.class).getUniqueMappedResult();
        long total = 0;
        if (countResult != null && countResult.containsKey("total")) {
            total = ((Number) countResult.get("total")).longValue();
        }

        long skip = (long) searchRequest.getPage() * searchRequest.getSize();
        Aggregation dataAgg = Aggregation.newAggregation(
            Aggregation.match(criteria),
            Aggregation.unwind("images"),
            Aggregation.addFields()
                .addField("images.createdAt")
                .withValue("$createdAt")
                .addField("images.resourceType")
                .withValue("$resourceType")
                .build(),
            Aggregation.sort(Sort.Direction.DESC, "images.createdAt"),
            Aggregation.skip(skip),
            Aggregation.limit(searchRequest.getSize()),
            Aggregation.replaceRoot("images")
        );
        List<Image> images = mongoTemplate.aggregate(dataAgg, "files", Image.class).getMappedResults();
        int totalPages = (int) Math.ceil((double) total / searchRequest.getSize());

        List<ImageResponse> list = images.stream().map(ImageResponse::toImageResponse).toList();
        list.forEach(this::fillPresignedUrl);
        return new SearchResponse<>(
            list,
            PageResponse.builder()
                .currentPage(searchRequest.getPage() + 1)
                .size(searchRequest.getSize())
                .total(total)
                .totalPages(totalPages)
                .count(images.size())
                .build()
        );
    }

    @Transactional(readOnly = true)
    public List<FileResponse> getFilesByIds(List<String> ids) {
        if (CommonUtils.isEmpty(ids)) return List.of();
        List<File> files = fileRepository.findAllByIdIn(ids);
        List<FileResponse> list = files.stream().map(FileResponse::toFileResponse).toList();
        list.forEach(this::fillPresignedUrls);
        return list;
    }

    @Transactional(readOnly = true)
    public ResponseObject<List<FileResponse>> getMyResources(Integer page, Integer size) {
        return getMyResources(new SearchRequest(null, page, size, "DESC", "createdAt"));
    }

    @Transactional(readOnly = true)
    public ResponseObject<List<FileResponse>> getMyResources(SearchRequest searchRequest) {
        String userId = CommonService.getCurrentUserLogin();
        Page<File> page = fileRepository.findAllByOwnerId(userId, searchRequest.toPageable());
        List<FileResponse> data = page.getContent().stream().map(FileResponse::toFileResponse).toList();
        data.forEach(this::fillPresignedUrls);
        PageResponse pagination = PageResponse.builder()
            .currentPage(searchRequest.page())
            .size(searchRequest.size())
            .total(page.getTotalElements())
            .totalPages(page.getTotalPages())
            .count(data.size())
            .build();
        return ResponseObject.<List<FileResponse>>builder().data(data).pagination(pagination).build();
    }

    @Transactional(readOnly = true)
    public FileResponse getFileById(String id) {
        File file = fileRepository.findById(id).orElseThrow(() -> new ApiException(ErrorMessage.FILE_NOT_FOUND));
        FileResponse resp = FileResponse.toFileResponse(file);
        fillPresignedUrls(resp);
        return resp;
    }

    @Transactional(readOnly = true)
    public ResponseObject<SearchResponse<MediaHistoryGroupDTO>> getUserMediaHistory(
        SearchRequest criteria,
        List<ResourceTypeGrpc> resourceTypes
    ) {
        SearchGrpcRequest searchRequest = SearchGrpcRequest.newBuilder()
            .setPage(Math.max(0, criteria.page() - 1))
            .setSize(criteria.size())
            .build();
        SearchResponse<ImageResponse> result = getFileImageByUserIdAndResourceType(
            criteria.searchText(), // userId
            resourceTypes,
            searchRequest
        );
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy").withZone(ZoneId.systemDefault());
        Map<String, List<ImageResponse>> grouped = result
            .data()
            .stream()
            .collect(
                Collectors.groupingBy(
                    img -> img.getCreatedAt() != null ? formatter.format(img.getCreatedAt()) : "Unknown",
                    LinkedHashMap::new,
                    Collectors.toList()
                )
            );
        List<MediaHistoryGroupDTO> groups = grouped
            .entrySet()
            .stream()
            .map(entry -> MediaHistoryGroupDTO.builder().date(entry.getKey()).items(entry.getValue()).build())
            .toList();
        return ResponseObject.success(new SearchResponse<>(groups, result.pagination()));
    }

    private void fillPresignedUrl(ImageResponse r) {
        if (r != null && r.getImageUrl() != null && !r.getImageUrl().startsWith("http")) r.setImageUrl(
            minioStorageService.getPresignedUrl(r.getImageUrl())
        );
    }

    private void fillPresignedUrl(VideoResponse r) {
        if (r != null && r.getVideoUrl() != null && !r.getVideoUrl().startsWith("http")) r.setVideoUrl(
            minioStorageService.getPresignedUrl(r.getVideoUrl())
        );
    }

    private void fillPresignedUrls(FileResponse f) {
        if (f == null) return;
        if (f.getImages() != null) f.getImages().forEach(this::fillPresignedUrl);
        if (f.getVideos() != null) f.getVideos().forEach(this::fillPresignedUrl);
    }

    public void removeObject(String objectKey) {
        minioStorageService.removeObject(objectKey);
    }

    public InputStream getObjectStream(String objectKey) {
        return minioStorageService.getObjectStream(objectKey);
    }
}
