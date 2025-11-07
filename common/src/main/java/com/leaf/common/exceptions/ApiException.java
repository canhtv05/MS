package com.leaf.common.exceptions;

import lombok.Getter;

import java.io.Serial;

@Getter
public class ApiException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    private final ErrorMessage errorMessage;

    public ApiException(ErrorMessage errorMessage) {
        super(errorMessage.getMessage());
        this.errorMessage = errorMessage;
    }

    public ApiException(ErrorMessage errorMessage, String message) {
        super(message);
        this.errorMessage = errorMessage;
    }

    public static ApiException error(ErrorMessage errorMessage) {
        return new ApiException(errorMessage);
    }
}
