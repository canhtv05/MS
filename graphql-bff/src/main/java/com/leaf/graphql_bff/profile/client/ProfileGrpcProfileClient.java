package com.leaf.graphql_bff.profile.client;

import com.leaf.common.grpc.UserProfileGrpcServiceGrpc;
import com.leaf.common.grpc.UserProfileIdRequest;
import com.leaf.common.grpc.UserProfileIntroduceDTO;
import com.leaf.common.grpc.UserProfilePrivacyDTO;
import com.leaf.common.grpc.UserProfileResponse;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

@Service
public class ProfileGrpcProfileClient {

    @GrpcClient("profile-service")
    private UserProfileGrpcServiceGrpc.UserProfileGrpcServiceBlockingStub stub;

    public UserProfileResponse getUserProfile(UserProfileIdRequest req) {
        return stub.getUserProfile(req);
    }

    public UserProfilePrivacyDTO getUserProfilePrivacy(UserProfileIdRequest req) {
        return stub.getUserProfilePrivacy(req);
    }

    public UserProfileIntroduceDTO getUserProfileIntroduce(UserProfileIdRequest req) {
        return stub.getUserProfileIntroduce(req);
    }
}
