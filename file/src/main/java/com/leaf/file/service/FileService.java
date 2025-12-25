package com.leaf.file.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.EagerTransformation;
import com.cloudinary.utils.ObjectUtils;
import com.leaf.common.dto.PageResponse;
import com.leaf.common.dto.ResponseObject;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.grpc.ResourceType;
import com.leaf.file.domain.Image;
import com.leaf.file.domain.Video;
import com.leaf.file.dto.FileResponse;
import com.leaf.file.dto.ImageResponse;
import com.leaf.file.dto.VideoResponse;
import com.leaf.file.repository.FileRepository;
import com.leaf.file.service.FileService;
import com.leaf.framework.security.SecurityUtils;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
                imageResponses.add(processImageUpload(file, resourceType, userId));
            } else if (contentType.startsWith("video")) {
                videoResponses.add(processVideoUpload(file, resourceType, userId));
            }
        }

        if (totalSize > 20 * 1024 * 1024) {
            throw new ApiException(ErrorMessage.FILE_SIZE_EXCEEDED);
        }

        return saveFileMetadata(userId, totalSize, imageResponses, videoResponses);
    }

    public ImageResponse processImageUpload(MultipartFile file, ResourceType resourceType, String userId)
        throws IOException {
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

        return ImageResponse.builder()
            .contentType(file.getContentType())
            .imageUrl(result.get("secure_url").toString())
            .fileSize(file.getSize())
            .originFileName(file.getOriginalFilename())
            .publicId(result.get("public_id").toString())
            .build();
    }

    public VideoResponse processVideoUpload(MultipartFile file, ResourceType resourceType, String userId)
        throws IOException {
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
            .build();
    }

    private FileResponse saveFileMetadata(
        String userId,
        long totalSize,
        List<ImageResponse> imageResponses,
        List<VideoResponse> videoResponses
    ) {
        String id = UUID.randomUUID().toString();

        com.leaf.file.domain.File fileEntity = com.leaf.file.domain.File.builder()
            .id(id)
            .ownerId(userId)
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
                            .build()
                    )
                    .toList()
            )
            .build();

        fileRepository.save(fileEntity);

        return FileResponse.builder()
            .ownerId(userId)
            .id(id)
            .totalSize(totalSize)
            .images(imageResponses)
            .videos(videoResponses)
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
}
