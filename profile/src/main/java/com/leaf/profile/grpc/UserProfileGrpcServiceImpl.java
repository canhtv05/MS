package com.leaf.profile.grpc;

import com.leaf.common.grpc.UserProfileDTO;
import com.leaf.common.grpc.UserProfileGrpcServiceGrpc;
import com.leaf.common.grpc.UserProfileIdRequest;
import com.leaf.common.grpc.UserProfileIntroduceDTO;
import com.leaf.common.grpc.UserProfilePrivacyDTO;
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
    public void createUserProfile(UserProfileDTO request, StreamObserver<UserProfileDTO> responseObserver) {
        UserProfileCreationReq userProfileCreationReq = userProfileGrpcMapper.toUserProfileCreationReq(request);
        UserProfileResponse newUserProfile = userProfileService.createUserProfile(userProfileCreationReq);
        UserProfileDTO response = userProfileGrpcMapper.toGrpcUserProfileDTO(newUserProfile);

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void getUserProfile(
        UserProfileIdRequest request,
        StreamObserver<com.leaf.common.grpc.UserProfileResponse> responseObserver
    ) {
        UserProfileResponse userProfile = userProfileService.getUserProfile(request.getUserId());
        com.leaf.common.grpc.UserProfileResponse grpcResponse = userProfileGrpcMapper.toGrpcUserProfileResponse(
            userProfile
        );

        responseObserver.onNext(grpcResponse);
        responseObserver.onCompleted();
    }

    @Override
    public void getUserProfilePrivacy(
        UserProfileIdRequest request,
        StreamObserver<UserProfilePrivacyDTO> responseObserver
    ) {
        com.leaf.profile.dto.UserProfilePrivacyDTO userProfilePrivacy = userProfilePrivacyService.getUserProfilePrivacy(
            request.getUserId()
        );
        com.leaf.common.grpc.UserProfilePrivacyDTO grpcResponse =
            userProfilePrivacyGrpcMapper.toGrpcUserProfilePrivacyDTO(userProfilePrivacy);

        responseObserver.onNext(grpcResponse);
        responseObserver.onCompleted();
    }

    @Override
    public void getUserProfileIntroduce(
        UserProfileIdRequest request,
        StreamObserver<UserProfileIntroduceDTO> responseObserver
    ) {
        com.leaf.profile.dto.UserProfileIntroduceDTO userProfileIntroduce =
            userProfileIntroduceService.getUserProfileIntroduce(request.getUserId());
        com.leaf.common.grpc.UserProfileIntroduceDTO grpcResponse =
            userProfileIntroduceGrpcMapper.toGrpcUserProfileIntroduceDTO(userProfileIntroduce);

        responseObserver.onNext(grpcResponse);
        responseObserver.onCompleted();
    }
}
