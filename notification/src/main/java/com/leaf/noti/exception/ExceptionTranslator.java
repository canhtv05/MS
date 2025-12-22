package com.leaf.noti.exception;

import com.leaf.common.dto.ResponseObject;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.support.MethodArgumentNotValidException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(name = "ExceptionTranslatorNotification")
public class ExceptionTranslator {

    @ExceptionHandler(ApiException.class)
    public <T> ResponseEntity<ResponseObject<T>> handleBadRequest(ApiException ex) {
        return ResponseEntity.badRequest().body(ResponseObject.error(ex.getErrorMessage(), ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseObject<Map<String, String>>> handleValidationErrors(
        MethodArgumentNotValidException ex
    ) {
        Map<String, String> errors = new HashMap<>();
        ex
            .getBindingResult()
            .getFieldErrors()
            .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.badRequest().body(ResponseObject.error(ErrorMessage.VALIDATION_ERROR, errors));
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ResponseObject<Void>> handlingAccessDeniedException(AccessDeniedException exception) {
        ErrorMessage errorMessage = ErrorMessage.ACCESS_DENIED;

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
            ResponseObject.<Void>builder().code(errorMessage.getCode()).message(errorMessage.getMessage()).build()
        );
    }
}
