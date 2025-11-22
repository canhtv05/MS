package com.leaf.profile.grpc;

import com.leaf.common.exception.ApiException;
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
        try {
            UserProfileCreationReq userProfileCreationReq = UserProfileCreationReq.builder()
                    .email(request.getEmail())
                    .userId(request.getUserId())
                    .fullname(request.getFullname())
                    .build();

            UserProfileResponse newUserProfile = userProfileService.createUserProfile(userProfileCreationReq);
            UserProfileDTO response = UserProfileDTO.newBuilder()
                    .setEmail(newUserProfile.getEmail())
                    .setUserId(newUserProfile.getUsername())
                    .setFullname(newUserProfile.getFullname())
                    .build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (ApiException e) {
            responseObserver.onError(io.grpc.Status.ALREADY_EXISTS
                    .withDescription(e.getMessage())
                    .asRuntimeException());
        } catch (Exception e) {
            responseObserver.onError(io.grpc.Status.ALREADY_EXISTS
                    .withDescription(e.getMessage())
                    .asRuntimeException());
        }
    }

}
