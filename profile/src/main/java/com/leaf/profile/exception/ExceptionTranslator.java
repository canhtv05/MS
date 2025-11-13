package com.leaf.profile.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.leaf.common.dto.ResponseObject;
import com.leaf.common.exception.ApiException;

@RestControllerAdvice(name = "ExceptionTranslatorProfile")
public class ExceptionTranslator {

    @ExceptionHandler(ApiException.class)
    public <T> ResponseEntity<ResponseObject<T>> handleBadRequest(ApiException ex) {
        return ResponseEntity.badRequest().body(ResponseObject.error(ex.getErrorMessage(), ex.getMessage()));
    }
}
