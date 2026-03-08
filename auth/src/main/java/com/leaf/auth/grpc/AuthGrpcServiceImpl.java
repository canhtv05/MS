package com.leaf.auth.grpc;

import com.leaf.auth.mapper.AuthGrpcMapper;
import com.leaf.auth.security.jwt.TokenProvider;
import com.leaf.auth.service.AuthService;
import com.leaf.auth.service.UserService;
import com.leaf.common.grpc.AuthGrpcServiceGrpc;
import com.leaf.common.grpc.AuthMeGrpcRequest;
import com.leaf.common.grpc.AuthMeGrpcResponse;
import com.leaf.common.grpc.RefreshTokenGrpcRequest;
import com.leaf.common.grpc.RefreshTokenGrpcResponse;
import com.leaf.common.grpc.VerifyEmailTokenGrpcDTO;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
@RequiredArgsConstructor
public class AuthGrpcServiceImpl extends AuthGrpcServiceGrpc.AuthGrpcServiceImplBase {

    private final AuthService authService;
    private final UserService userService;
    private final TokenProvider tokenProvider;

    @Override
    public void verifyEmailToken(
        VerifyEmailTokenGrpcDTO request,
        StreamObserver<VerifyEmailTokenGrpcDTO> responseObserver
    ) {
        var response = userService.activeUserByUserName(request);
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void refreshToken(
        RefreshTokenGrpcRequest request,
        StreamObserver<RefreshTokenGrpcResponse> responseObserver
    ) {
        var response = tokenProvider.processRefreshInternal(request.getRefreshToken(), request.getChannel());
        responseObserver.onNext(
            RefreshTokenGrpcResponse.newBuilder()
                .setAccessToken(response.getAccessToken())
                .setRefreshToken(response.getRefreshToken())
                .build()
        );
        responseObserver.onCompleted();
    }

    @Override
    public void authMe(AuthMeGrpcRequest request, StreamObserver<AuthMeGrpcResponse> responseObserver) {
        var response = authService.getProfile(request.getUserId());
        responseObserver.onNext(AuthGrpcMapper.getInstance().toAuthMeGrpcResponse(response));
        responseObserver.onCompleted();
    }
}
