package com.leaf.file.mapper;

import com.google.protobuf.Timestamp;
import com.leaf.common.dto.PageResponse;
import com.leaf.common.grpc.FileGrpcResponse;
import com.leaf.common.grpc.ImageGrpcResponse;
import com.leaf.common.grpc.PageGrpcResponse;
import com.leaf.common.grpc.ResourceTypeGrpc;
import com.leaf.common.grpc.VideoGrpcResponse;
import com.leaf.file.dto.FileResponse;
import com.leaf.file.dto.ImageResponse;
import com.leaf.file.dto.VideoResponse;
import com.leaf.framework.blocking.util.CommonUtils;
import com.leaf.framework.blocking.util.ConvertProto;
import java.util.List;

public class FileProtoMapper {

    public static PageGrpcResponse toProto(PageResponse page) {
        return PageGrpcResponse.newBuilder()
            .setCurrentPage(page.getCurrentPage())
            .setSize(page.getSize())
            .setTotal(page.getTotal())
            .setTotalPages(page.getTotalPages())
            .setCount(page.getCount())
            .build();
    }

    public static FileGrpcResponse toProto(FileResponse response) {
        List<ImageGrpcResponse> images = response.getImages().stream().map(FileProtoMapper::mapImage).toList();

        List<VideoGrpcResponse> videos = response.getVideos().stream().map(FileProtoMapper::mapVideo).toList();

        FileGrpcResponse fileResponse = FileGrpcResponse.newBuilder()
            .setOwnerId(response.getOwnerId())
            .setTotalSize(response.getTotalSize())
            .addAllImages(images)
            .addAllVideos(videos)
            .build();

        return fileResponse;
    }

    public static VideoGrpcResponse mapVideo(VideoResponse v) {
        var builder = VideoGrpcResponse.newBuilder()
            .setPlaytimeSeconds(CommonUtils.getSafeObject(v.getPlaytimeSeconds(), Double.class, 0.0))
            .setPlaytimeString(CommonUtils.getSafeObject(v.getPlaytimeString(), String.class, ""))
            .setContentType(CommonUtils.getSafeObject(v.getContentType(), String.class, ""))
            .setVideoUrl(CommonUtils.getSafeObject(v.getVideoUrl(), String.class, ""))
            .setThumbnailUrl(CommonUtils.getSafeObject(v.getThumbnailUrl(), String.class, ""))
            .setFileSize(CommonUtils.getSafeObject(v.getFileSize(), Long.class, 0L))
            .setOriginFileName(CommonUtils.getSafeObject(v.getOriginFileName(), String.class, ""))
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
                    ResourceTypeGrpc.class,
                    ResourceTypeGrpc.RESOURCE_TYPE_UNSPECIFIED
                )
            );

        return builder.build();
    }

    public static ImageGrpcResponse mapImage(ImageResponse i) {
        var builder = ImageGrpcResponse.newBuilder()
            .setContentType(CommonUtils.getSafeObject(i.getContentType(), String.class, ""))
            .setImageUrl(CommonUtils.getSafeObject(i.getImageUrl(), String.class, ""))
            .setFileSize(CommonUtils.getSafeObject(i.getFileSize(), Long.class, 0L))
            .setOriginFileName(CommonUtils.getSafeObject(i.getOriginFileName(), String.class, ""))
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
                    ResourceTypeGrpc.class,
                    ResourceTypeGrpc.RESOURCE_TYPE_UNSPECIFIED
                )
            );

        return builder.build();
    }
}
