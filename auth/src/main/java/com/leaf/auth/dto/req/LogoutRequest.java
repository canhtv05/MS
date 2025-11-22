package com.leaf.auth.dto.req;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LogoutRequest {

    @NotBlank(message = "Channel is not blank")
    String channel;
}
