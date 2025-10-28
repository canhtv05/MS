package com.canhtv05.common.exceptions;

import lombok.Getter;

@Getter
public enum ErrorMessage {

    SUCCESS("00", "Success"),
    UNHANDLED_ERROR("1004", "Unhandled error"),
    VALIDATION_ERROR("400", "Validation error"),

    TENANT_ALREADY_EXITS("TENANT_ALREADY_EXITS", "Tenant already exists"),
    TENANT_NOT_FOUND("TENANT_NOT_FOUND", "Tenant not found"),

    USERNAME_ALREADY_EXITS("USERNAME_ALREADY_EXITS", "Username already exists"),
    EMAIL_ALREADY_EXITS("EMAIL_ALREADY_EXITS", "Username already exists"),
    INVALID_PASSWORD("INVALID_PASSWORD", "Invalid password"),
    USER_NOT_FOUND("USER_NOT_FOUND", "User not found"),
    CURRENT_PASSWORD_INVALID("CURRENT_PASSWORD_INVALID", "Current password invalid"),
    USER_ALREADY_MAPPING_EMPLOYEE("USER_ALREADY_MAPPING_EMPLOYEE", "User already mapping employee"),
    PERMISSION_ALREADY_EXITS("PERMISSION_ALREADY_EXITS", "Permission already exists"),
    PERMISSION_NOT_FOUND("PERMISSION_NOT_FOUND", "Permission not found"),
    EMPLOYEE_AND_USER_ARE_NOT_IN_THE_SAME_CLASS("EMPLOYEE_AND_USER_ARE_NOT_IN_THE_SAME_CLASS",
            "Employee and User are not in the same class"),
    ROLE_ALREADY_EXITS("ROLE_ALREADY_EXITS", "Role already exists"),
    ROLE_NOT_FOUND("ROLE_NOT_FOUND", "Role not found"),
    IMPORT_EXCEL_ERROR("IMPORT_EXCEL_ERROR", "Xử lý file lỗi"),
    FILE_EXCEL_INVALID_TENANT("FILE_EXCEL_INVALID_TENANT", "File dữ liệu không đúng tenant"),

    ID_CARD_NUMBER_ALREADY_EXITS("ID_CARD_NUMBER_ALREADY_EXITS", "Số GTTT đã tồn tại"),
    EMPLOYEE_CODE_NOT_FOUND("EMPLOYEE_CODE_NOT_FOUND", "Mã nhân viên không tồn tại"),
    EMPLOYEE_ID_NOT_FOUND("EMPLOYEE_ID_CODE_NOT_FOUND", "Mã nhân viên không tồn tại"),
    EMPLOYEE_NOT_FOUND("EMPLOYEE_NOT_FOUND", "Nhân viên không tồn tại"),
    TAX_CODE_ALREADY_EXITS("TAX_CODE_ALREADY_EXITS", "Mã thuế đã tồn tại"),
    EMPLOYEE_CODE_ALREADY_CREATED("EMPLOYEE_CODE_ALREADY_CREATED", "EMPLOYEE_CODE_ALREADY_CREATED"),
    EMPLOYEE_ID_ALREADY_EXITS("EMPLOYEE_ID_ALREADY_EXITS", "Mã Employee đã tồn tại"),
    ID_CARD_NUMBER_ALREADY_EXISTS("ID_CARD_NUMBER_ALREADY_EXISTS", "Mã thẻ căn cước đã tồn tại"),
    SOCIAL_INSURANCE_NO_ALREADY_EXISTS("SOCIAL_INSURANCE_NO_ALREADY_EXISTS", "Mã bảo hiểm xã hội đã tồn tại"),
    EMPLOYEE_CODE_ALREADY_EXITS("EMPLOYEE_CODE_ALREADY_EXITS", "Mã nhân viên đã tồn tại");

    private final String code;
    private final String message;

    ErrorMessage(String code, String message) {
        this.code = code;
        this.message = message;
    }
}
