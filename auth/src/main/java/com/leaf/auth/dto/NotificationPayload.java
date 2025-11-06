package com.leaf.auth.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;

import com.leaf.auth.enums.NotificationType;

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
