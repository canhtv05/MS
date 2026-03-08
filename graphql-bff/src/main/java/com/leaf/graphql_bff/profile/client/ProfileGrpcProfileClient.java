package com.leaf.graphql_bff.profile.client;

import com.leaf.common.grpc.UserProfileGrpcResponse;
import com.leaf.common.grpc.UserProfileGrpcServiceGrpc;
import com.leaf.common.grpc.UserProfileIdGrpcRequest;
import com.leaf.common.grpc.UserProfileIntroduceGrpcDTO;
import com.leaf.common.grpc.UserProfilePrivacyGrpcDTO;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

@Service
public class ProfileGrpcProfileClient {

    @GrpcClient("profile-service")
    private UserProfileGrpcServiceGrpc.UserProfileGrpcServiceBlockingStub stub;

    public UserProfileGrpcResponse getUserProfile(UserProfileIdGrpcRequest req) {
        return stub.getUserProfile(req);
    }

    public UserProfilePrivacyGrpcDTO getUserProfilePrivacy(UserProfileIdGrpcRequest req) {
        return stub.getUserProfilePrivacy(req);
    }

    public UserProfileIntroduceGrpcDTO getUserProfileIntroduce(UserProfileIdGrpcRequest req) {
        return stub.getUserProfileIntroduce(req);
    }
}
