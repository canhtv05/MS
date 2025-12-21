package com.leaf.graphql_bff.auth.client;

import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.grpc.AuthGrpcServiceGrpc;
import com.leaf.common.grpc.AuthMeRequest;
import com.leaf.common.grpc.AuthMeResponse;
import io.grpc.StatusRuntimeException;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

@Service
public class GrpcAuthClient {

    @GrpcClient("auth-service")
    private AuthGrpcServiceGrpc.AuthGrpcServiceBlockingStub stub;

    public AuthMeResponse authMe(String username) {
        try {
            return stub.authMe(AuthMeRequest.newBuilder().setUserId(username).build());
        } catch (StatusRuntimeException e) {
            if (e.getStatus().getCode() == io.grpc.Status.Code.NOT_FOUND) {
                throw new ApiException(ErrorMessage.UNAUTHENTICATED);
            }
            throw e;
        }
    }
}
