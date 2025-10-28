package com.canhtv05.auth.dto;

import com.canhtv05.auth.enums.NotificationType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationPayload<T> implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    NotificationType type;
    String sessionId;
    String username;
    String title;
    String message;
    Instant timestamp;
    T data;
}
