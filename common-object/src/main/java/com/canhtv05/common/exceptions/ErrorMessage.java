package com.canhtv05.common.exceptions;

import lombok.Getter;

@Getter
public enum ErrorMessage {

    SUCCESS("00", "Success"),
    UNHANDLED_ERROR("1004", "Unhandled error"),
    VALIDATION_ERROR("400", "Validation error"),
    UNAUTHENTICATED("401", "Unauthenticated"),
    REFRESH_TOKEN_INVALID("400", "Refresh token invalid"),
    ACCESS_TOKEN_INVALID("400", "Access token invalid"),

    USERNAME_ALREADY_EXITS("USERNAME_ALREADY_EXITS", "Username already exists"),
    EMAIL_ALREADY_EXITS("EMAIL_ALREADY_EXITS", "Username already exists"),
    INVALID_PASSWORD("INVALID_PASSWORD", "Invalid password"),
    USER_NOT_FOUND("USER_NOT_FOUND", "User not found"),
    CURRENT_PASSWORD_INVALID("CURRENT_PASSWORD_INVALID", "Current password invalid"),
    PERMISSION_ALREADY_EXITS("PERMISSION_ALREADY_EXITS", "Permission already exists"),
    PERMISSION_NOT_FOUND("PERMISSION_NOT_FOUND", "Permission not found"),
    ROLE_ALREADY_EXITS("ROLE_ALREADY_EXITS", "Role already exists"),
    ROLE_NOT_FOUND("ROLE_NOT_FOUND", "Role not found"),
    IMPORT_EXCEL_ERROR("IMPORT_EXCEL_ERROR", "Xử lý file lỗi");

    private final String code;
    private final String message;

    ErrorMessage(String code, String message) {
        this.code = code;
        this.message = message;
    }
}
