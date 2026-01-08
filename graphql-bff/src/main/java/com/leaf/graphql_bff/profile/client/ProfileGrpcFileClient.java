package com.leaf.graphql_bff.profile.client;

import com.leaf.common.grpc.FileGrpcServiceGrpc;
import com.leaf.common.grpc.GetFileImagesRequest;
import com.leaf.common.grpc.GetFileImagesResponse;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

@Service
public class ProfileGrpcFileClient {

    @GrpcClient("file-service")
    private FileGrpcServiceGrpc.FileGrpcServiceBlockingStub stub;

    public GetFileImagesResponse getFileImagesResponse(GetFileImagesRequest request) {
        return stub.getFileImages(request);
    }
}
