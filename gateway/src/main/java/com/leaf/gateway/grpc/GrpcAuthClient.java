package com.leaf.gateway.grpc;

import org.springframework.stereotype.Service;

import com.leaf.common.grpc.AuthGrpcServiceGrpc;
import com.leaf.common.grpc.VerifyTokenRequest;
import com.leaf.common.grpc.VerifyTokenResponse;

import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.client.inject.GrpcClient;
import reactor.core.publisher.Mono;

@Service
public class GrpcAuthClient {

    @GrpcClient("auth-service")
    private AuthGrpcServiceGrpc.AuthGrpcServiceStub asyncStub;

    public Mono<VerifyTokenResponse> verifyToken(String token) {
        VerifyTokenRequest request = VerifyTokenRequest.newBuilder().setToken(token).build();

        return Mono.create(sink -> asyncStub.verifyToken(request, new StreamObserver<>() {
            @Override
            public void onNext(VerifyTokenResponse value) {
                sink.success(value);
            }

            @Override
            public void onError(Throwable t) {
                sink.error(t);
            }

            @Override
            public void onCompleted() {
            }
        }));
    }
}
