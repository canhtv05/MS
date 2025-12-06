package com.leaf.file.mapper;

import com.leaf.file.dto.FileResponse;
import com.leaf.file.dto.ImageResponse;
import com.leaf.file.dto.VideoResponse;
import java.util.List;

public class FileProtoMapper {

    public static com.leaf.common.grpc.FileResponse toProto(FileResponse response) {
        List<com.leaf.common.grpc.ImageResponse> images = response
            .getImages()
            .stream()
            .map(FileProtoMapper::mapImage)
            .toList();

        List<com.leaf.common.grpc.VideoResponse> videos = response
            .getVideos()
            .stream()
            .map(FileProtoMapper::mapVideo)
            .toList();

        com.leaf.common.grpc.FileResponse fileResponse =
            com.leaf.common.grpc.FileResponse.newBuilder()
                .setOwnerId(response.getOwnerId())
                .setTotalSize(response.getTotalSize())
                .addAllImages(images)
                .addAllVideos(videos)
                .build();

        return fileResponse;
    }

    private static com.leaf.common.grpc.VideoResponse mapVideo(VideoResponse v) {
        return com.leaf.common.grpc.VideoResponse.newBuilder()
            .setPlaytimeSeconds(v.getPlaytimeSeconds())
            .setPlaytimeString(v.getPlaytimeString())
            .setContentType(v.getContentType())
            .setVideoUrl(v.getVideoUrl())
            .setThumbnailUrl(v.getThumbnailUrl())
            .setFileSize(v.getFileSize())
            .setOriginFileName(v.getOriginFileName())
            .setPublicId(v.getPublicId())
            .build();
    }

    private static com.leaf.common.grpc.ImageResponse mapImage(ImageResponse i) {
        return com.leaf.common.grpc.ImageResponse.newBuilder()
            .setContentType(i.getContentType())
            .setImageUrl(i.getImageUrl())
            .setFileSize(i.getFileSize())
            .setOriginFileName(i.getOriginFileName())
            .setPublicId(i.getPublicId())
            .build();
    }
}
