package com.leaf.profile.grpc;

import com.leaf.common.grpc.UserProfileGrpcDTO;
import com.leaf.common.grpc.UserProfileGrpcResponse;
import com.leaf.common.grpc.UserProfileGrpcServiceGrpc;
import com.leaf.common.grpc.UserProfileIdGrpcRequest;
import com.leaf.common.grpc.UserProfileIntroduceGrpcDTO;
import com.leaf.common.grpc.UserProfilePrivacyGrpcDTO;
import com.leaf.profile.dto.UserProfileIntroduceDTO;
import com.leaf.profile.dto.UserProfilePrivacyDTO;
import com.leaf.profile.dto.req.UserProfileCreationReq;
import com.leaf.profile.dto.res.UserProfileResponse;
import com.leaf.profile.mapper.UserProfileGrpcMapper;
import com.leaf.profile.mapper.UserProfileIntroduceGrpcMapper;
import com.leaf.profile.mapper.UserProfilePrivacyGrpcMapper;
import com.leaf.profile.service.UserProfileIntroduceService;
import com.leaf.profile.service.UserProfilePrivacyService;
import com.leaf.profile.service.UserProfileService;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
@RequiredArgsConstructor
public class UserProfileGrpcServiceImpl extends UserProfileGrpcServiceGrpc.UserProfileGrpcServiceImplBase {

    private final UserProfileService userProfileService;
    private final UserProfilePrivacyService userProfilePrivacyService;
    private final UserProfileIntroduceService userProfileIntroduceService;

    private final UserProfileGrpcMapper userProfileGrpcMapper = UserProfileGrpcMapper.getInstance();
    private final UserProfilePrivacyGrpcMapper userProfilePrivacyGrpcMapper =
        UserProfilePrivacyGrpcMapper.getInstance();
    private final UserProfileIntroduceGrpcMapper userProfileIntroduceGrpcMapper =
        UserProfileIntroduceGrpcMapper.getInstance();

    @Override
    public void createUserProfile(UserProfileGrpcDTO request, StreamObserver<UserProfileGrpcDTO> responseObserver) {
        UserProfileCreationReq userProfileCreationReq = userProfileGrpcMapper.toUserProfileCreationReq(request);
        UserProfileResponse newUserProfile = userProfileService.createUserProfile(userProfileCreationReq);
        UserProfileGrpcDTO response = userProfileGrpcMapper.toGrpcUserProfileDTO(newUserProfile);

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void getUserProfile(
        UserProfileIdGrpcRequest request,
        StreamObserver<UserProfileGrpcResponse> responseObserver
    ) {
        UserProfileResponse userProfile = userProfileService.getUserProfile(request.getUserId());
        UserProfileGrpcResponse grpcResponse = userProfileGrpcMapper.toGrpcUserProfileResponse(userProfile);

        responseObserver.onNext(grpcResponse);
        responseObserver.onCompleted();
    }

    @Override
    public void getUserProfilePrivacy(
        UserProfileIdGrpcRequest request,
        StreamObserver<UserProfilePrivacyGrpcDTO> responseObserver
    ) {
        UserProfilePrivacyDTO userProfilePrivacy = userProfilePrivacyService.getUserProfilePrivacy(request.getUserId());
        UserProfilePrivacyGrpcDTO grpcResponse = userProfilePrivacyGrpcMapper.toGrpcUserProfilePrivacyDTO(
            userProfilePrivacy
        );

        responseObserver.onNext(grpcResponse);
        responseObserver.onCompleted();
    }

    @Override
    public void getUserProfileIntroduce(
        UserProfileIdGrpcRequest request,
        StreamObserver<UserProfileIntroduceGrpcDTO> responseObserver
    ) {
        UserProfileIntroduceDTO userProfileIntroduce = userProfileIntroduceService.getUserProfileIntroduce(
            request.getUserId()
        );
        UserProfileIntroduceGrpcDTO grpcResponse = userProfileIntroduceGrpcMapper.toGrpcUserProfileIntroduceDTO(
            userProfileIntroduce
        );

        responseObserver.onNext(grpcResponse);
        responseObserver.onCompleted();
    }
}
