package com.canhtv05.file.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(500, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHORIZED(403, "You do not have permission", HttpStatus.FORBIDDEN),
    API_ENDPOINT_NOT_FOUND(404, "API endpoint not found.", HttpStatus.NOT_FOUND),
    INVALID_TOKEN(400, "Invalid token.", HttpStatus.BAD_REQUEST),
    FILE_NOT_FOUND(404, "File not found.", HttpStatus.NOT_FOUND),
    ;

    ErrorCode(int code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }

    int code;
    String message;
    HttpStatus status;
}
