package com.leaf.graphql_bff.auth.client;

import com.leaf.common.grpc.UserProfileGrpcResponse;
import com.leaf.common.grpc.UserProfileGrpcServiceGrpc;
import com.leaf.common.grpc.UserProfileIdGrpcRequest;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

@Service
public class AuthGrpcProfileClient {

    @GrpcClient("profile-service")
    private UserProfileGrpcServiceGrpc.UserProfileGrpcServiceBlockingStub stub;

    public UserProfileGrpcResponse getUserProfile(UserProfileIdGrpcRequest req) {
        return stub.getUserProfile(req);
    }
}
