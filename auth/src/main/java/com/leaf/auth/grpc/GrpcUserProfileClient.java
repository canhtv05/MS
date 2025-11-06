package com.leaf.auth.grpc;

import org.springframework.stereotype.Service;

import com.leaf.common.grpc.UserProfileDTO;
import com.leaf.common.grpc.UserProfileGrpcServiceGrpc;

import net.devh.boot.grpc.client.inject.GrpcClient;

@Service
public class GrpcUserProfileClient {

    @GrpcClient("profile-service")
    private UserProfileGrpcServiceGrpc.UserProfileGrpcServiceBlockingStub stub;

    public UserProfileDTO createUserProfile(UserProfileDTO req) {
        return stub.createUserProfile(req);
    }
}
