package com.canhtv05.auth.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.canhtv05.auth.domain.Role;
import com.canhtv05.auth.domain.User;
import com.canhtv05.common.utils.JsonF;
import com.canhtv05.common.utils.json.LowerCaseTrimDeserializer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.io.Serial;
import java.io.Serializable;
import java.util.Map;
import java.util.Set;

@Setter
@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ImportUserDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @JsonDeserialize(using = LowerCaseTrimDeserializer.class)
    @NotBlank(message = "Trường thông tin không được để trống")
    private String username;

    @JsonDeserialize(using = LowerCaseTrimDeserializer.class)
    @NotBlank(message = "Trường thông tin không được để trống")
    private String email;

    @JsonDeserialize(using = LowerCaseTrimDeserializer.class)
    @NotBlank(message = "Trường thông tin không được để trống")
    @Pattern(regexp = "^[A-Za-z0-9]+$", message = "Chỉ cho phép chữ và số")
    private String password;

    private String role;

    public static ImportUserDTO fromExcelData(Map<String, String> item) {
        ImportUserDTO dto = JsonF.jsonToObject(JsonF.toJson(item), ImportUserDTO.class);
        return dto;
    }

    public User toEntity(String password, Set<Role> roles) {
        return User.builder()
                .username(username.toLowerCase())
                .password(password)
                .roles(roles)
                .activated(true)
                .isGlobal(false)
                .build();
    }
}
