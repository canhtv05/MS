package com.leaf.graphql_bff.auth.client;

import com.leaf.common.grpc.AuthGrpcServiceGrpc;
import com.leaf.common.grpc.AuthMeRequest;
import com.leaf.common.grpc.AuthMeResponse;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class AuthGrpcAuthClient {

    @GrpcClient("auth-service")
    private AuthGrpcServiceGrpc.AuthGrpcServiceBlockingStub stub;

    public AuthMeResponse authMe(String username) {
        return stub.authMe(AuthMeRequest.newBuilder().setUserId(username).build());
    }
}
