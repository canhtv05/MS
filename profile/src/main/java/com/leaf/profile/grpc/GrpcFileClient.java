package com.leaf.profile.grpc;

import com.google.protobuf.ByteString;
import com.leaf.common.grpc.FileGrpcServiceGrpc;
import com.leaf.common.grpc.GetFileImagesRequest;
import com.leaf.common.grpc.GetFileImagesResponse;
import com.leaf.common.grpc.ImageResponse;
import com.leaf.common.grpc.ResourceType;
import com.leaf.common.grpc.SearchRequest;
import com.leaf.common.grpc.UploadOneImageRequest;
import java.io.IOException;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
public class GrpcFileClient {

    @GrpcClient("file-service")
    private FileGrpcServiceGrpc.FileGrpcServiceBlockingStub stub;

    public ImageResponse uploadImage(MultipartFile file, ResourceType resourceType, String userId) throws IOException {
        log.info("Uploading image via gRPC. File size: {} bytes, userId: {}", file.getSize(), userId);
        byte[] bytes = file.getBytes();
        ImageResponse response = stub.uploadImage(
            UploadOneImageRequest.newBuilder()
                .setFile(ByteString.copyFrom(bytes))
                .setResourceType(resourceType)
                .setUserId(userId)
                .build()
        );
        log.info("gRPC upload successful. Image URL: {}", response.getImageUrl());
        return response;
    }

    public GetFileImagesResponse getFileImages(
        String userId,
        List<ResourceType> resourceTypes,
        SearchRequest searchRequest
    ) {
        GetFileImagesResponse response = stub.getFileImages(
            GetFileImagesRequest.newBuilder()
                .setUserId(userId)
                .addAllResourceTypes(resourceTypes)
                .setSearchRequest(searchRequest)
                .build()
        );
        return response;
    }
}
