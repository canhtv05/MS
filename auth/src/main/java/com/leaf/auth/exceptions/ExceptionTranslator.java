package com.leaf.auth.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.leaf.common.dto.ResponseObject;

@RestControllerAdvice(name = "ExceptionTranslatorAuth")
public class ExceptionTranslator {

    @ExceptionHandler(CustomAuthenticationException.class)
    public <T> ResponseEntity<ResponseObject<T>> handleBadRequest(CustomAuthenticationException ex) {
        return ResponseEntity.badRequest()
                .body(ResponseObject.error(String.valueOf(HttpStatus.BAD_REQUEST.value()), ex.getMessage()));
    }
}
