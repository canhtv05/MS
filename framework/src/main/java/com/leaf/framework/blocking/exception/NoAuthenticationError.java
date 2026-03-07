package com.leaf.framework.blocking.exception;

import java.util.HashMap;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class NoAuthenticationError extends RuntimeException {

    private HttpStatus status;
    private String message;
    private Map<String, String> errorDetails;

    public NoAuthenticationError(String message) {
        super(message);
        this.errorDetails = new HashMap<>();
        this.message = message;
        this.status = HttpStatus.UNAUTHORIZED;
    }

    public NoAuthenticationError(String message, Map<String, String> errorDetails) {
        super(message);
        this.errorDetails = errorDetails;
        this.message = message;
        this.status = HttpStatus.UNAUTHORIZED;
    }

    public NoAuthenticationError(HttpStatus status, String message) {
        super(message);
        this.status = status;
        this.message = message;
        this.errorDetails = new HashMap<>();
    }
}
