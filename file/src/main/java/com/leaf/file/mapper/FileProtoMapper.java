package com.leaf.file.mapper;

import com.google.protobuf.Timestamp;
import com.leaf.common.dto.PageResponse;
import com.leaf.common.grpc.ResourceType;
import com.leaf.common.utils.CommonUtils;
import com.leaf.common.utils.ConvertProto;
import com.leaf.file.dto.FileResponse;
import com.leaf.file.dto.ImageResponse;
import com.leaf.file.dto.VideoResponse;
import java.util.List;

public class FileProtoMapper {

    public static com.leaf.common.grpc.PageResponse toProto(PageResponse page) {
        return com.leaf.common.grpc.PageResponse.newBuilder()
            .setCurrentPage(page.getCurrentPage())
            .setSize(page.getSize())
            .setTotal(page.getTotal())
            .setTotalPages(page.getTotalPages())
            .setCount(page.getCount())
            .build();
    }

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

        com.leaf.common.grpc.FileResponse fileResponse = com.leaf.common.grpc.FileResponse.newBuilder()
            .setOwnerId(response.getOwnerId())
            .setTotalSize(response.getTotalSize())
            .addAllImages(images)
            .addAllVideos(videos)
            .build();

        return fileResponse;
    }

    public static com.leaf.common.grpc.VideoResponse mapVideo(VideoResponse v) {
        var builder = com.leaf.common.grpc.VideoResponse.newBuilder()
            .setPlaytimeSeconds(CommonUtils.getSafeObject(v.getPlaytimeSeconds(), Double.class, 0.0))
            .setPlaytimeString(CommonUtils.getSafeObject(v.getPlaytimeString(), String.class, ""))
            .setContentType(CommonUtils.getSafeObject(v.getContentType(), String.class, ""))
            .setVideoUrl(CommonUtils.getSafeObject(v.getVideoUrl(), String.class, ""))
            .setThumbnailUrl(CommonUtils.getSafeObject(v.getThumbnailUrl(), String.class, ""))
            .setFileSize(CommonUtils.getSafeObject(v.getFileSize(), Long.class, 0L))
            .setOriginFileName(CommonUtils.getSafeObject(v.getOriginFileName(), String.class, ""))
            .setPublicId(CommonUtils.getSafeObject(v.getPublicId(), String.class, ""))
            .setCreatedAt(
                CommonUtils.getSafeObject(
                    ConvertProto.convertInstantToTimestamp(v.getCreatedAt()),
                    Timestamp.class,
                    Timestamp.getDefaultInstance()
                )
            )
            .setResourceType(
                CommonUtils.getSafeObject(
                    v.getResourceType(),
                    ResourceType.class,
                    ResourceType.RESOURCE_TYPE_UNSPECIFIED
                )
            );

        return builder.build();
    }

    public static com.leaf.common.grpc.ImageResponse mapImage(ImageResponse i) {
        var builder = com.leaf.common.grpc.ImageResponse.newBuilder()
            .setContentType(CommonUtils.getSafeObject(i.getContentType(), String.class, ""))
            .setImageUrl(CommonUtils.getSafeObject(i.getImageUrl(), String.class, ""))
            .setFileSize(CommonUtils.getSafeObject(i.getFileSize(), Long.class, 0L))
            .setOriginFileName(CommonUtils.getSafeObject(i.getOriginFileName(), String.class, ""))
            .setPublicId(CommonUtils.getSafeObject(i.getPublicId(), String.class, ""))
            .setCreatedAt(
                CommonUtils.getSafeObject(
                    ConvertProto.convertInstantToTimestamp(i.getCreatedAt()),
                    Timestamp.class,
                    Timestamp.getDefaultInstance()
                )
            )
            .setResourceType(
                CommonUtils.getSafeObject(
                    i.getResourceType(),
                    ResourceType.class,
                    ResourceType.RESOURCE_TYPE_UNSPECIFIED
                )
            );

        return builder.build();
    }
}
