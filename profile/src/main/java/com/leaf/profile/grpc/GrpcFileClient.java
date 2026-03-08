package com.leaf.profile.grpc;

import com.google.protobuf.ByteString;
import com.leaf.common.grpc.FileGrpcServiceGrpc;
import com.leaf.common.grpc.GetFileImagesGrpcRequest;
import com.leaf.common.grpc.GetFileImagesGrpcResponse;
import com.leaf.common.grpc.ImageGrpcResponse;
import com.leaf.common.grpc.ResourceTypeGrpc;
import com.leaf.common.grpc.SearchGrpcRequest;
import com.leaf.common.grpc.UploadOneImageGrpcRequest;
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

    public ImageGrpcResponse uploadImage(MultipartFile file, ResourceTypeGrpc resourceType, String userId)
        throws IOException {
        log.info("Uploading image via gRPC. File size: {} bytes, userId: {}", file.getSize(), userId);
        byte[] bytes = file.getBytes();
        ImageGrpcResponse response = stub.uploadImage(
            UploadOneImageGrpcRequest.newBuilder()
                .setFile(ByteString.copyFrom(bytes))
                .setResourceType(resourceType)
                .setUserId(userId)
                .build()
        );
        log.info("gRPC upload successful. Image URL: {}", response.getImageUrl());
        return response;
    }

    public GetFileImagesGrpcResponse getFileImages(
        String userId,
        List<ResourceTypeGrpc> resourceTypes,
        SearchGrpcRequest searchRequest
    ) {
        GetFileImagesGrpcResponse response = stub.getFileImages(
            GetFileImagesGrpcRequest.newBuilder()
                .setUserId(userId)
                .addAllResourceTypes(resourceTypes)
                .setSearchRequest(searchRequest)
                .build()
        );
        return response;
    }
}
