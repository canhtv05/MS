package com.leaf.auth.grpc;

import com.leaf.auth.mapper.AuthGrpcMapper;
import com.leaf.auth.security.jwt.TokenProvider;
import com.leaf.auth.service.AuthService;
import com.leaf.auth.service.UserService;
import com.leaf.common.grpc.AuthGrpcServiceGrpc;
import com.leaf.common.grpc.AuthMeRequest;
import com.leaf.common.grpc.AuthMeResponse;
import com.leaf.common.grpc.RefreshTokenRequest;
import com.leaf.common.grpc.RefreshTokenResponse;
import com.leaf.common.grpc.VerifyEmailTokenDTO;
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
    public void verifyEmailToken(VerifyEmailTokenDTO request, StreamObserver<VerifyEmailTokenDTO> responseObserver) {
        var response = userService.activeUserByUserName(request);
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void refreshToken(RefreshTokenRequest request, StreamObserver<RefreshTokenResponse> responseObserver) {
        var response = tokenProvider.processRefreshInternal(request.getRefreshToken(), request.getChannel());
        responseObserver.onNext(
            RefreshTokenResponse.newBuilder()
                .setAccessToken(response.getAccessToken())
                .setRefreshToken(response.getRefreshToken())
                .build()
        );
        responseObserver.onCompleted();
    }

    @Override
    public void authMe(AuthMeRequest request, StreamObserver<AuthMeResponse> responseObserver) {
        var response = authService.getProfile(request.getUserId());
        responseObserver.onNext(AuthGrpcMapper.getInstance().toAuthMeResponse(response));
        responseObserver.onCompleted();
    }
}
