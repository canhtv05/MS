package com.leaf.graphql_bff.profile.client;

import com.leaf.common.grpc.FileGrpcServiceGrpc;
import com.leaf.common.grpc.GetFileImagesGrpcRequest;
import com.leaf.common.grpc.GetFileImagesGrpcResponse;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

@Service
public class ProfileGrpcFileClient {

    @GrpcClient("file-service")
    private FileGrpcServiceGrpc.FileGrpcServiceBlockingStub stub;

    public GetFileImagesGrpcResponse getFileImagesResponse(GetFileImagesGrpcRequest request) {
        return stub.getFileImages(request);
    }
}
