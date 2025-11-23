package com.leaf.noti.grpc;

import org.springframework.stereotype.Service;

import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.grpc.VerifyEmailTokenDTO;
import com.leaf.common.grpc.AuthGrpcServiceGrpc.AuthGrpcServiceBlockingStub;

import io.grpc.StatusRuntimeException;
import net.devh.boot.grpc.client.inject.GrpcClient;

@Service
public class GrpcUserProfileClient {

    @GrpcClient("auth-service")
    private AuthGrpcServiceBlockingStub stub;

    public VerifyEmailTokenDTO verifyEmailToken(VerifyEmailTokenDTO req) {
        try {
            return stub.verifyEmailToken(req);
        } catch (StatusRuntimeException e) {
            if (e.getStatus().getCode() == io.grpc.Status.Code.NOT_FOUND) {
                throw new ApiException(ErrorMessage.VERIFY_EMAIL_TOKEN_ERROR);
            }
        }
        return null;
    }
}
