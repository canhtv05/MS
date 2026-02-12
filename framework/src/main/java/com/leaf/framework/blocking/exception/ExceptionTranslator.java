package com.leaf.framework.blocking.exception;

import com.leaf.common.dto.ResponseObject;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@Slf4j
@RestControllerAdvice(name = "ExceptionTranslatorFramework")
public class ExceptionTranslator {

    @ExceptionHandler(Exception.class)
    public <T> ResponseEntity<ResponseObject<T>> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            ResponseObject.error("500", ErrorMessage.UNHANDLED_ERROR.getMessage())
        );
    }

    @ExceptionHandler(ApiException.class)
    public <T> ResponseEntity<ResponseObject<T>> handleApiException(ApiException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            ResponseObject.error(ex.getErrorMessage(), ex.getMessage())
        );
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public <T> ResponseEntity<ResponseObject<T>> handleBadRequest(NoResourceFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseObject.error("400", ex.getLocalizedMessage()));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public <T> ResponseEntity<ResponseObject<T>> handleBadRequest(HttpRequestMethodNotSupportedException ex) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(
            ResponseObject.error("405", ex.getLocalizedMessage())
        );
    }
}
