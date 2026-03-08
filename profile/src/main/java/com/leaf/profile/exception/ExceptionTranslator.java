package com.leaf.profile.exception;

import com.leaf.common.dto.ResponseObject;
import com.leaf.common.exception.ErrorMessage;
import lombok.extern.slf4j.Slf4j;
import org.neo4j.driver.exceptions.ClientException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice(name = "ExceptionTranslatorProfile")
public class ExceptionTranslator {

    @ExceptionHandler(ClientException.class)
    public <T> ResponseEntity<ResponseObject<T>> handleNeo4jClientException(ClientException ex) {
        log.error("Neo4j Client Exception: ", ex);

        String message = ex.getMessage();
        if (
            message != null &&
            (message.contains("already exists") || message.contains("constraint") || message.contains("unique"))
        ) {
            return ResponseEntity.badRequest().body(ResponseObject.error(ErrorMessage.INTEREST_TITLE_ALREADY_EXISTS));
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            ResponseObject.error(ErrorMessage.UNHANDLED_ERROR)
        );
    }
}
