package com.canhtv05.file.service.impl;

import com.canhtv05.file.dto.ApiResponse;
import com.canhtv05.file.dto.MetaResponse;
import com.canhtv05.file.dto.PageResponse;
import com.canhtv05.file.dto.res.FileResponse;
import com.canhtv05.file.dto.res.ImageResponse;
import com.canhtv05.file.dto.res.VideoResponse;
import com.canhtv05.file.domain.Image;
import com.canhtv05.file.domain.Video;
import com.canhtv05.file.exception.AppException;
import com.canhtv05.file.exception.ErrorCode;
import com.canhtv05.file.mapper.FileMapper;
import com.canhtv05.file.repository.FileRepository;
import com.canhtv05.file.service.FileService;
import com.cloudinary.Cloudinary;
import com.cloudinary.EagerTransformation;
import com.cloudinary.utils.ObjectUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import org.mp4parser.IsoFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FileServiceImplementation implements FileService {

        Cloudinary cloudinary;
        FileRepository fileRepository;
        FileMapper fileMapper;

        @Override
        public FileResponse upload(MultipartFile[] files) throws IOException {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                String userId = auth.getName();

                String imageString = "image";
                String videoString = "video";
                String secureUrl = "secure_url";
                String publicId = "public_id";

                List<ImageResponse> imageResponses = new ArrayList<>();
                List<VideoResponse> videoResponses = new ArrayList<>();
                long totalSize = 0L;

                for (MultipartFile file : files) {
                        String contentType = file.getContentType();
                        if (contentType == null)
                                continue;

                        totalSize += file.getSize();

                        if (contentType.startsWith(imageString)) {
                                var imageResult = cloudinary.uploader().upload(
                                                file.getBytes(),
                                                ObjectUtils.asMap(
                                                                "resource_type", imageString,
                                                                "upload_preset", "social-media",
                                                                "folder", imageString));
                                String imageUrl = imageResult.get(secureUrl).toString();
                                String imagePublicId = imageResult.get(publicId).toString();

                                imageResponses.add(ImageResponse.builder()
                                                .contentType(file.getContentType())
                                                .imageUrl(imageUrl)
                                                .fileSize(file.getSize())
                                                .originFileName(file.getOriginalFilename())
                                                .publicId(imagePublicId)
                                                .build());

                        } else if (contentType.startsWith(videoString)) {
                                File tmpFile = File.createTempFile("upload-", ".mp4");
                                tmpFile.deleteOnExit();
                                try (FileOutputStream os = new FileOutputStream(tmpFile)) {
                                        os.write(file.getBytes());
                                }

                                IsoFile isoFile = new IsoFile(tmpFile.getAbsolutePath());
                                long duration = isoFile.getMovieBox().getMovieHeaderBox().getDuration();
                                long timescale = isoFile.getMovieBox().getMovieHeaderBox().getTimescale();
                                isoFile.close();

                                long durationMillis = (duration * 1000) / timescale;
                                double durationSec = durationMillis / 1000.0;

                                var videoResult = cloudinary.uploader().upload(
                                                file.getBytes(),
                                                ObjectUtils.asMap(
                                                                "resource_type", videoString,
                                                                "upload_preset", "social-media",
                                                                "folder", videoString,
                                                                "eager", List.of(
                                                                                new EagerTransformation()
                                                                                                .width(320)
                                                                                                .height(240)
                                                                                                .crop("thumb")
                                                                                                .fetchFormat("jpg"))));

                                String videoUrl = videoResult.get(secureUrl).toString();
                                String videoPublicId = videoResult.get(publicId).toString();
                                @SuppressWarnings("unchecked")
                                String thumbnailUrl = ((List<Map<String, String>>) videoResult.get("eager")).getFirst()
                                                .get(
                                                                secureUrl);

                                videoResponses.add(VideoResponse.builder()
                                                .contentType(file.getContentType())
                                                .videoUrl(videoUrl)
                                                .thumbnailUrl(thumbnailUrl)
                                                .playtimeSeconds(durationSec)
                                                .playtimeString(formatDuration(durationMillis))
                                                .fileSize(file.getSize())
                                                .originFileName(file.getOriginalFilename())
                                                .publicId(videoPublicId)
                                                .build());
                        }
                }

                String id = UUID.randomUUID().toString();

                com.canhtv05.file.domain.File fileEntity = com.canhtv05.file.domain.File.builder()
                                .id(id)
                                .ownerId(userId)
                                .totalSize(totalSize)
                                .images(imageResponses.stream().map(img -> Image.builder()
                                                .contentType(img.getContentType())
                                                .imageUrl(img.getImageUrl())
                                                .fileSize(img.getFileSize())
                                                .originFileName(img.getOriginFileName())
                                                .publicId(img.getPublicId())
                                                .build()).toList())
                                .videos(videoResponses.stream().map(vid -> Video.builder()
                                                .contentType(vid.getContentType())
                                                .videoUrl(vid.getVideoUrl())
                                                .thumbnailUrl(vid.getThumbnailUrl())
                                                .playtimeSeconds(vid.getPlaytimeSeconds())
                                                .playtimeString(vid.getPlaytimeString())
                                                .fileSize(vid.getFileSize())
                                                .originFileName(vid.getOriginFileName())
                                                .publicId(vid.getPublicId())
                                                .build()).toList())
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

        @Override
        public ApiResponse<List<FileResponse>> getMyResources(Integer page, Integer size) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                String userId = auth.getName();

                Pageable pageable = PageRequest.of(Math.max(0, page - 1), size, Sort.by(Sort.Order.desc("createdAt")));
                Page<com.canhtv05.file.domain.File> pageResponse = fileRepository.findAllByOwnerId(userId, pageable);

                MetaResponse metaResponse = MetaResponse.builder()
                                .pagination(PageResponse.builder()
                                                .currentPage(page)
                                                .size(size)
                                                .total(pageResponse.getTotalElements())
                                                .totalPages(pageResponse.getTotalPages())
                                                .count(pageResponse.getContent().size())
                                                .build())
                                .build();

                var result = pageResponse.getContent().stream()
                                .map(fileMapper::toFileResponse)
                                .toList();

                return ApiResponse.<List<FileResponse>>builder()
                                .data(result)
                                .meta(metaResponse)
                                .build();
        }

        @Override
        public FileResponse getFileById(String id) {
                return fileRepository.getFileById(id)
                                .orElseThrow(() -> new AppException(ErrorCode.FILE_NOT_FOUND));
        }

        @Override
        public List<FileResponse> getFilesByIds(List<String> ids) {
                return fileRepository.findAllByIdIn(ids).stream().map(fileMapper::toFileResponse).toList();
        }

        private String formatDuration(long millis) {
                long seconds = millis / 1000;
                return String.format("%d:%02d", seconds / 60, seconds % 60);
        }

        @Override
        public Void deleteById(String fileId) {
                com.canhtv05.file.domain.File file = fileRepository.findById(fileId)
                                .orElseThrow(() -> new AppException(ErrorCode.FILE_NOT_FOUND));

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
                        Map<String, Object> options = ObjectUtils.asMap("resource_type", resourceType);
                        cloudinary.uploader().destroy(publicId, options);
                } catch (IOException e) {
                        // throw new AppException(ErrorCode.CLOUDINARY_DELETE_FAILED, "Failed to delete
                        // file", e);
                }
        }
}
