package com.leaf.auth.dto.req;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
public class VerifyOTPReq {

    @NotBlank(message = "OTP is required")
    @JsonProperty("OTP")
    private String OTP;

    @NotBlank(message = "Email is required")
    @Email(message = "Email is invalid")
    private String email;
}
