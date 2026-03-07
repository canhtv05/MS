package com.leaf.common.socket;

import com.leaf.common.grpc.WsMessageProto;
import com.leaf.common.grpc.WsType;
import org.apache.commons.lang3.ObjectUtils;

public final class WsMessageProtoMapper {

    private WsMessageProtoMapper() {}

    public static WsMessage fromProto(WsMessageProto proto) {
        if (ObjectUtils.isEmpty(proto)) {
            return null;
        }
        WsMessage.WsType type = toWsType(proto.getType());
        return WsMessage.builder()
            .type(type)
            .topic(proto.getTopic().isEmpty() ? null : proto.getTopic())
            .userId(proto.getUserId().isEmpty() ? null : proto.getUserId())
            .message(proto.getMessage().isEmpty() ? null : proto.getMessage())
            .data(proto.getData().isEmpty() ? null : proto.getData())
            .build();
    }

    public static WsMessageProto toProto(WsMessage msg) {
        if (ObjectUtils.isEmpty(msg)) {
            return WsMessageProto.getDefaultInstance();
        }
        WsMessageProto.Builder b = WsMessageProto.newBuilder()
            .setType(toProtoType(msg.getType()))
            .setTopic(msg.getTopic() != null ? msg.getTopic() : "")
            .setUserId(msg.getUserId() != null ? msg.getUserId() : "")
            .setMessage(msg.getMessage() != null ? msg.getMessage() : "")
            .setData(msg.getData() != null ? msg.getData() : "");
        return b.build();
    }

    public static byte[] toByteArray(WsMessage msg) {
        return toProto(msg).toByteArray();
    }

    public static WsMessage fromByteArray(byte[] bytes) throws com.google.protobuf.InvalidProtocolBufferException {
        return fromProto(WsMessageProto.parseFrom(bytes));
    }

    private static WsMessage.WsType toWsType(WsType proto) {
        if (proto == null || proto == WsType.UNRECOGNIZED || proto == WsType.WS_TYPE_UNSPECIFIED) {
            return null;
        }
        return switch (proto) {
            case WS_TYPE_PING -> WsMessage.WsType.PING;
            case WS_TYPE_PONG -> WsMessage.WsType.PONG;
            case WS_TYPE_SUBSCRIBE -> WsMessage.WsType.SUBSCRIBE;
            case WS_TYPE_UNSUBSCRIBE -> WsMessage.WsType.UNSUBSCRIBE;
            case WS_TYPE_KICK -> WsMessage.WsType.KICK;
            case WS_TYPE_ERROR -> WsMessage.WsType.ERROR;
            case WS_TYPE_MESSAGE -> WsMessage.WsType.MESSAGE;
            case WS_TYPE_RESPONSE_API -> WsMessage.WsType.RESPONSE_API;
            case WS_TYPE_FRIEND_REQUEST -> WsMessage.WsType.FRIEND_REQUEST;
            case WS_TYPE_USER_ONLINE -> WsMessage.WsType.USER_ONLINE;
            case WS_TYPE_USER_OFFLINE -> WsMessage.WsType.USER_OFFLINE;
            case WS_TYPE_CHECK_USER_ONLINE -> WsMessage.WsType.CHECK_USER_ONLINE;
            case WS_TYPE_USER_ONLINE_STATUS -> WsMessage.WsType.USER_ONLINE_STATUS;
            default -> null;
        };
    }

    private static WsType toProtoType(WsMessage.WsType type) {
        if (type == null) {
            return WsType.WS_TYPE_UNSPECIFIED;
        }
        return switch (type) {
            case PING -> WsType.WS_TYPE_PING;
            case PONG -> WsType.WS_TYPE_PONG;
            case SUBSCRIBE -> WsType.WS_TYPE_SUBSCRIBE;
            case UNSUBSCRIBE -> WsType.WS_TYPE_UNSUBSCRIBE;
            case KICK -> WsType.WS_TYPE_KICK;
            case ERROR -> WsType.WS_TYPE_ERROR;
            case MESSAGE -> WsType.WS_TYPE_MESSAGE;
            case RESPONSE_API -> WsType.WS_TYPE_RESPONSE_API;
            case FRIEND_REQUEST -> WsType.WS_TYPE_FRIEND_REQUEST;
            case USER_ONLINE -> WsType.WS_TYPE_USER_ONLINE;
            case USER_OFFLINE -> WsType.WS_TYPE_USER_OFFLINE;
            case CHECK_USER_ONLINE -> WsType.WS_TYPE_CHECK_USER_ONLINE;
            case USER_ONLINE_STATUS -> WsType.WS_TYPE_USER_ONLINE_STATUS;
        };
    }
}
