package com.canhtv05.auth.exceptions;

import com.canhtv05.common.exceptions.ApiException;
import com.canhtv05.common.exceptions.ErrorMessage;
import com.canhtv05.common.exceptions.ResponseObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class ExceptionTranslator {

    @ExceptionHandler(CustomAuthenticationException.class)
    public <T> ResponseEntity<ResponseObject<T>> handleAuthenticationException(CustomAuthenticationException ex) {
        log.info("handleAuthenticationException", ex);
        return new ResponseEntity<>(ResponseObject.error(String.valueOf(ex.getHttpStatus().value()), ex.getMessage()), ex.getHttpStatus());
    }

    @ExceptionHandler(ApiException.class)
    public <T> ResponseEntity<ResponseObject<T>> handleBadRequest(ApiException ex) {
        return ResponseEntity.ok(ResponseObject.error(ex.getErrorMessage(), ex.getMessage()));
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public <T> ResponseEntity<ResponseObject<T>> handleBadRequest(NoResourceFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseObject.error("400", ex.getLocalizedMessage()));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public <T> ResponseEntity<ResponseObject<T>> handleBadRequest(HttpRequestMethodNotSupportedException ex) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(ResponseObject.error("405", ex.getLocalizedMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseObject<Map<String, String>>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.badRequest().body(ResponseObject.error(ErrorMessage.VALIDATION_ERROR, errors));
    }

    @ExceptionHandler(Exception.class)
    public <T> ResponseEntity<ResponseObject<T>> handleGenericException(Exception ex) {
        log.error("An unexpected error occurred", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseObject.error("500", ErrorMessage.UNHANDLED_ERROR.getMessage()));
    }
}
