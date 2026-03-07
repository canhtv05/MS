package com.leaf.common.dto;

import java.io.Serial;
import java.io.Serializable;
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
public class UserSessionDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    String sessionId;
    String channel;
    String username;
    String secretKey;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthInfo {

        String channel;
        String username;
    }
}
