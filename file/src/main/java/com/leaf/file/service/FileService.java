package com.leaf.file.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.EagerTransformation;
import com.cloudinary.utils.ObjectUtils;
import com.leaf.common.dto.PageResponse;
import com.leaf.common.dto.ResponseObject;
import com.leaf.common.dto.search.SearchResponse;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.grpc.ResourceType;
import com.leaf.common.grpc.SearchRequest;
import com.leaf.file.domain.File;
import com.leaf.file.domain.Image;
import com.leaf.file.domain.Video;
import com.leaf.file.dto.FileResponse;
import com.leaf.file.dto.ImageResponse;
import com.leaf.file.dto.MediaHistoryGroupDTO;
import com.leaf.file.dto.VideoResponse;
import com.leaf.file.repository.FileRepository;
import com.leaf.file.service.FileService;
import com.leaf.framework.security.SecurityUtils;
import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FileService {

    Cloudinary cloudinary;
    FileRepository fileRepository;
    MongoTemplate mongoTemplate;

    public FileResponse upload(MultipartFile[] files, ResourceType resourceType) throws IOException {
        String userId = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new ApiException(ErrorMessage.UNAUTHENTICATED)
        );

        List<ImageResponse> imageResponses = new ArrayList<>();
        List<VideoResponse> videoResponses = new ArrayList<>();
        long totalSize = 0L;

        for (MultipartFile file : files) {
            String contentType = file.getContentType();
            if (contentType == null) continue;

            totalSize += file.getSize();

            if (contentType.startsWith("image")) {
                imageResponses.add(processImageUpload(file, resourceType, userId, true));
            } else if (contentType.startsWith("video")) {
                videoResponses.add(processVideoUpload(file, resourceType, userId, true));
            }
        }

        if (totalSize > 20 * 1024 * 1024) {
            throw new ApiException(ErrorMessage.FILE_SIZE_EXCEEDED);
        }

        return saveFileMetadata(userId, totalSize, imageResponses, videoResponses, resourceType);
    }

    public ImageResponse processImageUpload(
        MultipartFile file,
        ResourceType resourceType,
        String userId,
        boolean isUploadMany
    ) throws IOException {
        Long size = file.getSize();
        if (size > 20 * 1024 * 1024) {
            throw new ApiException(ErrorMessage.FILE_SIZE_EXCEEDED);
        }
        var result = cloudinary
            .uploader()
            .upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "resource_type",
                    "image",
                    "upload_preset",
                    "social-media",
                    "folder",
                    getResourcePath("image", resourceType, userId)
                )
            );

        if (!isUploadMany) {
            Image image = Image.builder()
                .contentType(file.getContentType())
                .imageUrl(result.get("secure_url").toString())
                .fileSize(file.getSize())
                .originFileName(file.getOriginalFilename())
                .publicId(result.get("public_id").toString())
                .createdAt(Instant.now())
                .resourceType(resourceType)
                .build();
            fileRepository.save(
                File.builder()
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .ownerId(userId)
                    .resourceType(resourceType)
                    .totalSize(file.getSize())
                    .images(List.of(image))
                    .build()
            );
        }

        return ImageResponse.builder()
            .contentType(file.getContentType())
            .imageUrl(result.get("secure_url").toString())
            .fileSize(file.getSize())
            .originFileName(file.getOriginalFilename())
            .publicId(result.get("public_id").toString())
            .createdAt(Instant.now())
            .resourceType(resourceType)
            .build();
    }

    public VideoResponse processVideoUpload(
        MultipartFile file,
        ResourceType resourceType,
        String userId,
        boolean isUploadMany
    ) throws IOException {
        Long size = file.getSize();
        if (size > 20 * 1024 * 1024) {
            throw new ApiException(ErrorMessage.FILE_SIZE_EXCEEDED);
        }
        var videoResult = cloudinary
            .uploader()
            .upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "resource_type",
                    "video",
                    "upload_preset",
                    "social-media",
                    "folder",
                    getResourcePath("video", resourceType, userId),
                    "eager",
                    List.of(
                        new EagerTransformation().width(320).height(240).crop("thumb").fetchFormat("jpg"),
                        new EagerTransformation().width(160).crop("scale").fetchFormat("vtt")
                    )
                )
            );

        double durationSec = Double.parseDouble(videoResult.get("duration").toString());
        long durationMillis = (long) (durationSec * 1000);

        String videoUrl = videoResult.get("secure_url").toString();
        String videoPublicId = videoResult.get("public_id").toString();

        @SuppressWarnings("unchecked")
        String thumbnailUrl = ((List<Map<String, String>>) videoResult.get("eager")).getFirst().get("secure_url");
        @SuppressWarnings("unchecked")
        String previewVttUrl = ((List<Map<String, String>>) videoResult.get("eager")).get(1).get("secure_url");

        if (!isUploadMany) {
            Video video = Video.builder()
                .contentType(file.getContentType())
                .videoUrl(videoUrl)
                .thumbnailUrl(thumbnailUrl)
                .playtimeSeconds(durationSec)
                .playtimeString(formatDuration(durationMillis))
                .fileSize(file.getSize())
                .originFileName(file.getOriginalFilename())
                .publicId(videoPublicId)
                .previewVttUrl(previewVttUrl)
                .createdAt(Instant.now())
                .resourceType(resourceType)
                .build();
            fileRepository.save(
                File.builder()
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .ownerId(userId)
                    .resourceType(resourceType)
                    .totalSize(file.getSize())
                    .videos(List.of(video))
                    .build()
            );
        }

        return VideoResponse.builder()
            .contentType(file.getContentType())
            .videoUrl(videoUrl)
            .thumbnailUrl(thumbnailUrl)
            .playtimeSeconds(durationSec)
            .playtimeString(formatDuration(durationMillis))
            .fileSize(file.getSize())
            .originFileName(file.getOriginalFilename())
            .publicId(videoPublicId)
            .previewVttUrl(previewVttUrl)
            .createdAt(Instant.now())
            .resourceType(resourceType)
            .build();
    }

    private FileResponse saveFileMetadata(
        String userId,
        long totalSize,
        List<ImageResponse> imageResponses,
        List<VideoResponse> videoResponses,
        ResourceType resourceType
    ) {
        String id = UUID.randomUUID().toString();

        com.leaf.file.domain.File fileEntity = com.leaf.file.domain.File.builder()
            .id(id)
            .ownerId(userId)
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .totalSize(totalSize)
            .images(
                imageResponses
                    .stream()
                    .map(img ->
                        Image.builder()
                            .contentType(img.getContentType())
                            .imageUrl(img.getImageUrl())
                            .fileSize(img.getFileSize())
                            .originFileName(img.getOriginFileName())
                            .publicId(img.getPublicId())
                            .resourceType(img.getResourceType())
                            .createdAt(img.getCreatedAt())
                            .build()
                    )
                    .toList()
            )
            .videos(
                videoResponses
                    .stream()
                    .map(vid ->
                        Video.builder()
                            .contentType(vid.getContentType())
                            .videoUrl(vid.getVideoUrl())
                            .thumbnailUrl(vid.getThumbnailUrl())
                            .playtimeSeconds(vid.getPlaytimeSeconds())
                            .playtimeString(vid.getPlaytimeString())
                            .fileSize(vid.getFileSize())
                            .originFileName(vid.getOriginFileName())
                            .publicId(vid.getPublicId())
                            .createdAt(vid.getCreatedAt())
                            .resourceType(vid.getResourceType())
                            .build()
                    )
                    .toList()
            )
            .resourceType(resourceType)
            .build();

        fileRepository.save(fileEntity);

        return FileResponse.builder()
            .ownerId(userId)
            .id(id)
            .totalSize(totalSize)
            .images(imageResponses)
            .videos(videoResponses)
            .resourceType(resourceType)
            .build();
    }

    public ResponseObject<List<FileResponse>> getMyResources(Integer page, Integer size) {
        String userId = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new ApiException(ErrorMessage.UNAUTHENTICATED)
        );

        Pageable pageable = PageRequest.of(Math.max(0, page - 1), size, Sort.by(Sort.Order.desc("createdAt")));
        Page<com.leaf.file.domain.File> pageResponse = fileRepository.findAllByOwnerId(userId, pageable);

        var result = pageResponse.getContent().stream().map(FileResponse::toFileResponse).toList();

        return ResponseObject.<List<FileResponse>>builder()
            .data(result)
            .pagination(
                PageResponse.builder()
                    .currentPage(page)
                    .size(size)
                    .total(pageResponse.getTotalElements())
                    .totalPages(pageResponse.getTotalPages())
                    .count(pageResponse.getContent().size())
                    .build()
            )
            .build();
    }

    public FileResponse getFileById(String id) {
        return fileRepository.getFileById(id).orElseThrow(() -> new ApiException(ErrorMessage.FILE_NOT_FOUND));
    }

    public List<FileResponse> getFilesByIds(List<String> ids) {
        return fileRepository.findAllByIdIn(ids).stream().map(FileResponse::toFileResponse).toList();
    }

    private String formatDuration(long millis) {
        long seconds = millis / 1000;
        return String.format("%d:%02d", seconds / 60, seconds % 60);
    }

    public Void deleteById(String fileId) {
        com.leaf.file.domain.File file = fileRepository
            .findById(fileId)
            .orElseThrow(() -> new ApiException(ErrorMessage.FILE_NOT_FOUND));

        ExecutorService executor = Executors.newFixedThreadPool(2);

        executor.submit(() -> {
            var videos = file.getVideos();
            if (videos != null) {
                for (var video : videos) {
                    String publicId = video.getPublicId();
                    if (publicId != null) {
                        this.deleteFile(publicId, "video");
                    }
                }
            }
        });

        executor.submit(() -> {
            var images = file.getImages();
            if (images != null) {
                for (var image : images) {
                    String publicId = image.getPublicId();
                    if (publicId != null) {
                        this.deleteFile(publicId, "image");
                    }
                }
            }
        });

        executor.shutdown();
        try {
            executor.awaitTermination(30, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("File deletion tasks interrupted", e);
        }

        fileRepository.delete(file);

        return null;
    }

    public void deleteFile(String publicId, String mimeType) {
        try {
            String resourceType = mimeType.startsWith("video") ? "video" : "image";
            @SuppressWarnings("unchecked")
            Map<String, Object> options = ObjectUtils.asMap("resource_type", resourceType);
            cloudinary.uploader().destroy(publicId, options);
        } catch (IOException e) {
            log.error("Failed to delete file", e);
        }
    }

    private String getResourcePath(String mimeType, ResourceType resourceType, String currentUser) {
        String type = mimeType.startsWith("video") ? "video" : "image";

        String result = String.format(
            "leafhub/%s/%s/%s/%s",
            type,
            currentUser,
            resourceType.name().toLowerCase(),
            LocalDate.now().toString()
        );
        return result;
    }

    public SearchResponse<ImageResponse> getFileImageByUserIdAndResourceType(
        String userId,
        List<ResourceType> resourceTypes,
        SearchRequest searchRequest
    ) {
        if (!fileRepository.existsByOwnerId(userId)) {
            return new SearchResponse<ImageResponse>(new ArrayList<>(), PageResponse.builder().build());
        }

        List<String> typeStrings = resourceTypes
            .stream()
            .map(r -> r.name())
            .toList();
        List<Integer> typeInts = resourceTypes
            .stream()
            .map(r -> r.getNumber())
            .toList();

        Criteria criteria = Criteria.where("ownerId")
            .is(userId)
            .orOperator(Criteria.where("resourceType").in(typeStrings), Criteria.where("resourceType").in(typeInts));

        Aggregation countAgg = Aggregation.newAggregation(
            Aggregation.match(criteria),
            Aggregation.unwind("images"),
            Aggregation.count().as("total")
        );

        Document countResult = mongoTemplate.aggregate(countAgg, "files", Document.class).getUniqueMappedResult();
        long totalCount = 0;
        if (countResult != null && countResult.containsKey("total")) {
            totalCount = ((Number) countResult.get("total")).longValue();
        }

        long skip = (long) searchRequest.getPage() * searchRequest.getSize();
        int limit = searchRequest.getSize();

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
            Aggregation.limit(limit),
            Aggregation.replaceRoot("images")
        );

        List<Image> images = mongoTemplate.aggregate(dataAgg, "files", Image.class).getMappedResults();

        int totalPages = (int) Math.ceil((double) totalCount / searchRequest.getSize());

        return new SearchResponse<ImageResponse>(
            images.stream().map(ImageResponse::toImageResponse).toList(),
            PageResponse.builder()
                .currentPage(searchRequest.getPage() + 1)
                .size(searchRequest.getSize())
                .total(totalCount)
                .totalPages(totalPages)
                .count(images.size())
                .build()
        );
    }

    public ResponseObject<SearchResponse<MediaHistoryGroupDTO>> getUserMediaHistory(
        com.leaf.common.dto.search.SearchRequest criteria,
        List<ResourceType> resourceType
    ) {
        SearchRequest searchRequest = SearchRequest.newBuilder()
            .setPage(Math.max(0, criteria.page() - 1))
            .setSize(criteria.size())
            .build();

        SearchResponse<ImageResponse> result = getFileImageByUserIdAndResourceType(
            criteria.searchText(), // userId
            resourceType,
            searchRequest
        );
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy").withZone(ZoneId.systemDefault());

        Map<String, List<ImageResponse>> groupedByDate = result
            .data()
            .stream()
            .collect(
                Collectors.groupingBy(
                    img -> {
                        Instant createdAt = img.getCreatedAt();
                        return dateFormatter.format(createdAt);
                    },
                    LinkedHashMap::new,
                    Collectors.toList()
                )
            );

        List<MediaHistoryGroupDTO> groupedResult = groupedByDate
            .entrySet()
            .stream()
            .map(entry -> MediaHistoryGroupDTO.builder().date(entry.getKey()).items(entry.getValue()).build())
            .toList();

        return ResponseObject.success(new SearchResponse<>(groupedResult, result.pagination()));
    }
}
