package com.leaf.common.socket;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.util.ObjectUtils;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WsMessage {

    private WsType type;
    private String topic;
    private String userId;
    private String message;
    private String data;

    public enum WsType {
        PING,
        PONG,
        SUBSCRIBE,
        UNSUBSCRIBE,
        KICK,
        ERROR,
        MESSAGE,
        RESPONSE_API,
        FRIEND_REQUEST,
        USER_ONLINE, // user vừa connect
        USER_OFFLINE, // user vừa disconnect
        CHECK_USER_ONLINE, // client -> server
        USER_ONLINE_STATUS // server -> client
    }

    public static WsMessage error(String message) {
        return WsMessage.builder()
            .type(WsType.ERROR)
            .message(ObjectUtils.isEmpty(message) ? "Hệ thống xảy ra lỗi!" : message)
            .build();
    }

    public static WsMessage error(String transId, String message) {
        return WsMessage.builder()
            .type(WsType.ERROR)
            .message(ObjectUtils.isEmpty(message) ? "Hệ thống xảy ra lỗi!" : message)
            .build();
    }
}
