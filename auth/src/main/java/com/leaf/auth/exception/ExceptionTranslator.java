package com.leaf.auth.exception;

import com.fasterxml.jackson.core.JsonParseException;
import com.leaf.common.dto.ResponseObject;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(name = "ExceptionTranslatorAuth")
public class ExceptionTranslator {

    @ExceptionHandler(CustomAuthenticationException.class)
    public <T> ResponseEntity<ResponseObject<T>> handleBadRequest(CustomAuthenticationException ex) {
        return ResponseEntity.badRequest().body(
            ResponseObject.error(String.valueOf(HttpStatus.BAD_REQUEST.value()), ex.getMessage())
        );
    }

    @ExceptionHandler(JsonParseException.class)
    public <T> ResponseEntity<T> handleParserCookie(JsonParseException ex) {
        return ResponseEntity.badRequest().body(null);
    }

    @ExceptionHandler(ApiException.class)
    public <T> ResponseEntity<ResponseObject<T>> handleBadRequest(ApiException ex) {
        return ResponseEntity.badRequest().body(ResponseObject.error(ex.getErrorMessage(), ex.getMessage()));
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ResponseObject<Void>> handlingAccessDeniedException(AccessDeniedException exception) {
        ErrorMessage errorMessage = ErrorMessage.ACCESS_DENIED;

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
            ResponseObject.<Void>builder().code(errorMessage.getCode()).message(errorMessage.getMessage()).build()
        );
    }
}
