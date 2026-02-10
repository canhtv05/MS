package com.leaf.common.exception;

import com.fasterxml.jackson.core.JsonParseException;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import jakarta.validation.ConstraintViolationException;
import net.devh.boot.grpc.server.advice.GrpcAdvice;
import net.devh.boot.grpc.server.advice.GrpcExceptionHandler;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@GrpcAdvice
public class GlobalGrpcExceptionTranslator {

    @GrpcExceptionHandler(ApiException.class)
    public StatusRuntimeException handleApiException(ApiException ex) {
        ErrorMessage error = ex.getErrorMessage();
        String description = error != null ? error.name() : ex.getMessage();
        if (description == null || description.isBlank()) {
            description = ErrorMessage.UNHANDLED_ERROR.name();
        }

        return Status.INTERNAL.withDescription(description).asRuntimeException();
    }

    @GrpcExceptionHandler(ConstraintViolationException.class)
    public StatusRuntimeException handleConstraintViolationException(ConstraintViolationException ex) {
        return Status.INVALID_ARGUMENT.withDescription("Validation error: " + ex.getMessage()).asRuntimeException();
    }

    @GrpcExceptionHandler(MethodArgumentNotValidException.class)
    public StatusRuntimeException handleValidationErrors(MethodArgumentNotValidException ex) {
        return Status.INVALID_ARGUMENT.withDescription(ex.getMessage()).asRuntimeException();
    }

    @GrpcExceptionHandler(JsonParseException.class)
    public StatusRuntimeException handleParserCookie(JsonParseException ex) {
        return Status.INVALID_ARGUMENT.withDescription(ex.getMessage()).asRuntimeException();
    }

    @GrpcExceptionHandler(MaxUploadSizeExceededException.class)
    public StatusRuntimeException handleMaxSizeException(MaxUploadSizeExceededException exc) {
        return Status.INVALID_ARGUMENT.withDescription("File exceeds the allowed size of 20mb").asRuntimeException();
    }

    @GrpcExceptionHandler(Exception.class)
    public StatusRuntimeException handleException(Exception ex) {
        String description = ex.getMessage();
        if (description == null || description.isBlank()) {
            description = ErrorMessage.UNHANDLED_ERROR.name();
        }
        return Status.INTERNAL.withDescription(description).asRuntimeException();
    }
}
