package com.leaf.common.exception;

import com.leaf.common.dto.ResponseObject;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@Slf4j
@RestControllerAdvice(name = "CommonExceptionTranslator")
public class GlobalRestExceptionTranslator {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseObject<Object>> handleGenericException(Exception ex) {
        log.error("Internal Server Error: ", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            ResponseObject.error("500", "Internal Server Error. Please contact admin.")
        );
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ResponseObject<Object>> handleApiException(ApiException ex) {
        log.error("Error: {}", ex);
        return ResponseEntity.badRequest().body(ResponseObject.error(ex.getErrorMessage().getCode(), ex.getMessage()));
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

    @ExceptionHandler({ HttpMessageNotReadableException.class })
    public ResponseEntity<ResponseObject<Object>> handleJsonError(HttpMessageNotReadableException ex) {
        log.warn("JSON Parse Error: {}", ex.getMessage());
        return ResponseEntity.badRequest().body(ResponseObject.error("400", "Malformed JSON request"));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ResponseObject<Object>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String error = "Parameter '" + ex.getName() + "' should be of type " + ex.getRequiredType().getSimpleName();
        return ResponseEntity.badRequest().body(ResponseObject.error("400", error));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ResponseObject<Void>> handleMaxSizeException(MaxUploadSizeExceededException exc) {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(
            ResponseObject.<Void>builder().code("413").message("File size exceeds the limit!").build()
        );
    }
}
