package com.leaf.graphql_bff.auth.client;

import com.leaf.common.grpc.UserProfileGrpcServiceGrpc;
import com.leaf.common.grpc.UserProfileIdRequest;
import com.leaf.common.grpc.UserProfileResponse;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

@Service
public class AuthGrpcProfileClient {

    @GrpcClient("profile-service")
    private UserProfileGrpcServiceGrpc.UserProfileGrpcServiceBlockingStub stub;

    public UserProfileResponse getUserProfile(UserProfileIdRequest req) {
        return stub.getUserProfile(req);
    }
}
