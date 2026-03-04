package com.leaf.common.dto.event;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VerificationEmailEvent {

    @NotBlank(message = "Email is required")
    @Email(message = "Email is invalid")
    String to;

    @NotBlank(message = "Username is required")
    String username;

    String fullName;
}
