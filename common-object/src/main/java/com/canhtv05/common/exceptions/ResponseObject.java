package com.canhtv05.common.exceptions;

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
public class ResponseObject<T> {

    private String code;
    private String message;
    private T data;

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
