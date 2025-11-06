package com.leaf.profile.grpc;

import com.leaf.common.grpc.UserProfileDTO;
import com.leaf.common.grpc.UserProfileGrpcServiceGrpc;
import com.leaf.profile.dto.UserProfileCreationReq;
import com.leaf.profile.dto.UserProfileResponse;
import com.leaf.profile.service.UserProfileService;

import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
@RequiredArgsConstructor
public class UserProfileGrpcServiceImpl extends UserProfileGrpcServiceGrpc.UserProfileGrpcServiceImplBase {

    private final UserProfileService userProfileService;

    @Override
    public void createUserProfile(UserProfileDTO request, StreamObserver<UserProfileDTO> responseObserver) {
        UserProfileCreationReq userProfileCreationReq = UserProfileCreationReq.builder()
                .email(request.getEmail())
                .userId(request.getUserId())
                .username(request.getUsername())
                .build();

        UserProfileResponse newUserProfile = userProfileService.createUserProfile(userProfileCreationReq);
        UserProfileDTO response = UserProfileDTO.newBuilder()
                .setEmail(newUserProfile.getEmail())
                .setUserId(newUserProfile.getUserId())
                .setUsername(newUserProfile.getUsername())
                .build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

}
