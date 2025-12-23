package com.leaf.auth.grpc;

import com.leaf.auth.mapper.AuthGrpcMapper;
import com.leaf.auth.service.AuthService;
import com.leaf.auth.service.UserService;
import com.leaf.common.grpc.AuthGrpcServiceGrpc;
import com.leaf.common.grpc.AuthMeRequest;
import com.leaf.common.grpc.AuthMeResponse;
import com.leaf.common.grpc.VerifyEmailTokenDTO;
import com.leaf.common.grpc.VerifyTokenRequest;
import com.leaf.common.grpc.VerifyTokenResponse;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
@RequiredArgsConstructor
public class AuthGrpcServiceImpl extends AuthGrpcServiceGrpc.AuthGrpcServiceImplBase {

    private final AuthService authService;
    private final UserService userService;

    @Override
    public void verifyToken(VerifyTokenRequest request, StreamObserver<VerifyTokenResponse> responseObserver) {
        var valid = authService.verifyToken(request.getToken(), true);

        VerifyTokenResponse response = VerifyTokenResponse.newBuilder().setValid(valid.getValid()).build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void verifyEmailToken(VerifyEmailTokenDTO request, StreamObserver<VerifyEmailTokenDTO> responseObserver) {
        try {
            var response = userService.activeUserByUserName(request);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            if (e.getMessage().contains("NOT_FOUND")) {
                responseObserver.onError(io.grpc.Status.NOT_FOUND.withDescription(e.getMessage()).asRuntimeException());
            } else {
                responseObserver.onError(io.grpc.Status.INTERNAL.withDescription(e.getMessage()).asRuntimeException());
            }
        }
    }

    @Override
    public void authMe(AuthMeRequest request, StreamObserver<AuthMeResponse> responseObserver) {
        try {
            var response = authService.getProfile(request.getUserId());
            responseObserver.onNext(AuthGrpcMapper.getInstance().toAuthMeResponse(response));
            responseObserver.onCompleted();
        } catch (Exception e) {
            if (e.getMessage().contains("NOT_FOUND")) {
                responseObserver.onError(io.grpc.Status.NOT_FOUND.withDescription(e.getMessage()).asRuntimeException());
            } else {
                responseObserver.onError(io.grpc.Status.INTERNAL.withDescription(e.getMessage()).asRuntimeException());
            }
        }
    }
}
