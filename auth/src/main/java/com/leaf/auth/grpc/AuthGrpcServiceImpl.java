package com.leaf.auth.grpc;

import com.leaf.common.grpc.AuthGrpcServiceGrpc;
import com.leaf.common.grpc.VerifyTokenRequest;
import com.leaf.common.grpc.VerifyTokenResponse;
import com.leaf.auth.service.AuthService;

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
