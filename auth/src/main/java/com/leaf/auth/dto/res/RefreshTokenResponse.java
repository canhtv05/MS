package com.leaf.auth.dto.res;

import java.io.Serializable;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RefreshTokenResponse implements Serializable {

    String accessToken;
    String refreshToken;
}
