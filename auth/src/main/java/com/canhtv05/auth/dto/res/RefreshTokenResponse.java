package com.canhtv05.auth.dto.res;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RefreshTokenResponse implements Serializable {

    String accessToken;
    String refreshToken;
}
