package com.canhtv05.auth.grpc;

import com.canhtv05.auth.service.AuthService;

import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
@RequiredArgsConstructor
public class AuthGrpcServiceImpl extends AuthGrpcServiceGrpc.AuthGrpcServiceImplBase {

	private final AuthService authService;

	@Override
	public void verifyToken(VerifyTokenRequest request, StreamObserver<VerifyTokenResponse> responseObserver) {
		var valid = authService.verifyToken(request.getToken());

		VerifyTokenResponse response = VerifyTokenResponse.newBuilder().setValid(valid.getValid()).build();
		responseObserver.onNext(response);
		responseObserver.onCompleted();
	}
}
