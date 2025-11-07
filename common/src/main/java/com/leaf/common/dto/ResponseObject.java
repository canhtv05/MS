package com.leaf.common.dto;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.leaf.common.exceptions.ErrorMessage;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(value = Include.NON_NULL)
public class ResponseObject<T> implements Serializable {

    private String code;
    private String message;
    private T data;
    private PageResponse pagination;

    public static <T> ResponseObject<T> success() {
        return ResponseObject.<T>builder()
                .code(ErrorMessage.SUCCESS.getCode())
                .message(ErrorMessage.SUCCESS.getMessage())
                .build();
    }

    public static <T> ResponseObject<T> success(T data) {
        return ResponseObject.<T>builder()
                .code(ErrorMessage.SUCCESS.getCode())
                .message(ErrorMessage.SUCCESS.getMessage())
                .data(data)
                .build();
    }

    public static <T> ResponseObject<T> success(T data, PageResponse pageResponse) {
        return ResponseObject.<T>builder()
                .code(ErrorMessage.SUCCESS.getCode())
                .message(ErrorMessage.SUCCESS.getMessage())
                .data(data)
                .pagination(pageResponse)
                .build();
    }

    public static <T> ResponseObject<T> error(String code, String message) {
        return ResponseObject.<T>builder()
                .code(code)
                .message(message)
                .build();
    }

    public static <T> ResponseObject<T> error(ErrorMessage errorMessage) {
        return ResponseObject.<T>builder()
                .code(errorMessage.getCode())
                .message(errorMessage.getMessage())
                .build();
    }

    public static <T> ResponseObject<T> error(ErrorMessage errorMessage, String message) {
        return ResponseObject.<T>builder()
                .code(errorMessage.getCode())
                .message(message)
                .build();
    }

    public static <T> ResponseObject<T> error(ErrorMessage errorMessage, T data) {
        return ResponseObject.<T>builder()
                .code(errorMessage.getCode())
                .message(errorMessage.getMessage())
                .data(data)
                .build();
    }
}
