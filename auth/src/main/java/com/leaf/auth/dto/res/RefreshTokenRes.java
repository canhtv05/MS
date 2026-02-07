package com.leaf.auth.dto.res;

import java.io.Serial;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RefreshTokenRes implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String accessToken;
    private String refreshToken;
}
