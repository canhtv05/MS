package com.leaf.auth.dto.req;

import jakarta.validation.constraints.NotBlank;
import java.io.Serial;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LoginReq implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotBlank(message = "Username is not blank")
    private String username;

    @NotBlank(message = "Password is not blank")
    private String password;

    @NotBlank(message = "Channel is not blank")
    private String channel;
}
