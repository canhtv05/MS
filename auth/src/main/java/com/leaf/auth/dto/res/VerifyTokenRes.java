package com.leaf.auth.dto.res;

import java.io.Serial;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class VerifyTokenRes implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Boolean valid;
    private String accessToken;
    private String refreshToken;
}
