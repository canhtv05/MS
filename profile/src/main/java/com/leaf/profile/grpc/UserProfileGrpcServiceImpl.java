package com.leaf.profile.grpc;

import com.leaf.common.grpc.UserProfileDTO;
import com.leaf.common.grpc.UserProfileGrpcServiceGrpc;
import com.leaf.common.grpc.UserProfileIdRequest;
import com.leaf.profile.dto.UserProfileCreationReq;
import com.leaf.profile.dto.UserProfileResponse;
import com.leaf.profile.mapper.UserProfileGrpcMapper;
import com.leaf.profile.service.UserProfileService;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
@RequiredArgsConstructor
public class UserProfileGrpcServiceImpl extends UserProfileGrpcServiceGrpc.UserProfileGrpcServiceImplBase {

    private final UserProfileService userProfileService;
    private final UserProfileGrpcMapper userProfileGrpcMapper;

    @Override
    public void createUserProfile(UserProfileDTO request, StreamObserver<UserProfileDTO> responseObserver) {
        try {
            UserProfileCreationReq userProfileCreationReq = userProfileGrpcMapper.toUserProfileCreationReq(request);
            UserProfileResponse newUserProfile = userProfileService.createUserProfile(userProfileCreationReq);
            UserProfileDTO response = userProfileGrpcMapper.toGrpcUserProfileDTO(newUserProfile);

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(
                io.grpc.Status.ALREADY_EXISTS.withDescription(e.getMessage()).asRuntimeException()
            );
        }
    }

    @Override
    public void getUserProfile(
        UserProfileIdRequest request,
        StreamObserver<com.leaf.common.grpc.UserProfileResponse> responseObserver
    ) {
        try {
            UserProfileResponse userProfile = userProfileService.getUserProfile(request.getUserId());
            com.leaf.common.grpc.UserProfileResponse grpcResponse = userProfileGrpcMapper.toGrpcUserProfileResponse(
                userProfile
            );

            responseObserver.onNext(grpcResponse);
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(io.grpc.Status.NOT_FOUND.withDescription(e.getMessage()).asRuntimeException());
        }
    }
}
