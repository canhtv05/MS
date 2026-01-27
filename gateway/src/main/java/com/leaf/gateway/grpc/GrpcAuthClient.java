package com.leaf.gateway.grpc;

import com.leaf.common.grpc.AuthGrpcServiceGrpc;
import com.leaf.common.grpc.RefreshTokenRequest;
import com.leaf.common.grpc.RefreshTokenResponse;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class GrpcAuthClient {

    @GrpcClient("auth-service")
    private AuthGrpcServiceGrpc.AuthGrpcServiceStub asyncStub;

    public Mono<RefreshTokenResponse> refreshToken(String refreshToken, String channel) {
        RefreshTokenRequest request = RefreshTokenRequest.newBuilder()
            .setRefreshToken(refreshToken)
            .setChannel(channel)
            .build();

        return Mono.create(sink ->
            asyncStub.refreshToken(
                request,
                new StreamObserver<RefreshTokenResponse>() {
                    @Override
                    public void onNext(RefreshTokenResponse value) {
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
