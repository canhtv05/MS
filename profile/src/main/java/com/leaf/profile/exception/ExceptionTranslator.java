package com.leaf.profile.exception;

import com.leaf.common.dto.ResponseObject;
import com.leaf.common.exception.ErrorMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(name = "ExceptionTranslatorProfile")
public class ExceptionTranslator {

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ResponseObject<Void>> handlingAccessDeniedException(AccessDeniedException exception) {
        ErrorMessage errorMessage = ErrorMessage.ACCESS_DENIED;

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
            ResponseObject.<Void>builder().code(errorMessage.getCode()).message(errorMessage.getMessage()).build()
        );
    }
}
