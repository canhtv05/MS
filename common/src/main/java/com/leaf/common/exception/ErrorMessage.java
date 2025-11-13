package com.leaf.common.exception;

import lombok.Getter;

@Getter
public enum ErrorMessage {

    SUCCESS("00", "Success"),
    UNHANDLED_ERROR("1004", "Unhandled error"),

    // auth
    VALIDATION_ERROR("400", "Validation error"),
    ACCESS_DENIED("403", "Access denied"),
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
    IMPORT_EXCEL_ERROR("IMPORT_EXCEL_ERROR", "Xử lý file lỗi"),

    // file
    FILE_NOT_FOUND("FILE_NOT_FOUND", "Không tìm thấy file"),

    // profile
    USER_PROFILE_NOT_FOUND("USER_PROFILE_NOT_FOUND", "Không tìm thấy thông tin người dùng"),
    FRIEND_REQUEST_ALREADY_SENT("FRIEND_REQUEST_ALREADY_SENT", "Yêu cầu kết bạn đã được gửi");

    private final String code;
    private final String message;

    ErrorMessage(String code, String message) {
        this.code = code;
        this.message = message;
    }
}
