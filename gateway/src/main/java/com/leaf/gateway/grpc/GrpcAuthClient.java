package com.leaf.gateway.grpc;

import com.leaf.common.grpc.AuthGrpcServiceGrpc;
import com.leaf.common.grpc.RefreshTokenGrpcRequest;
import com.leaf.common.grpc.RefreshTokenGrpcResponse;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class GrpcAuthClient {

    @GrpcClient("auth-service")
    private AuthGrpcServiceGrpc.AuthGrpcServiceStub asyncStub;

    public Mono<RefreshTokenGrpcResponse> refreshToken(String refreshToken, String channel) {
        RefreshTokenGrpcRequest request = RefreshTokenGrpcRequest.newBuilder()
            .setRefreshToken(refreshToken)
            .setChannel(channel)
            .build();

        return Mono.create(sink ->
            asyncStub.refreshToken(
                request,
                new StreamObserver<RefreshTokenGrpcResponse>() {
                    @Override
                    public void onNext(RefreshTokenGrpcResponse value) {
                        sink.success(value);
                    }

                    @Override
                    public void onError(Throwable t) {
                        sink.error(t);
                    }

                    @Override
                    public void onCompleted() {}
                }
            )
        );
    }
}
