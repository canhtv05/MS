package com.leaf.profile.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.leaf.common.utils.json.InstantToStringSerializer;
import com.leaf.profile.enums.FriendRequestStatus;
import java.io.Serializable;
import java.time.Instant;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SendFriendRequestDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    String senderId;
    String receiverId;

    @JsonSerialize(using = InstantToStringSerializer.class)
    Instant sendAt;

    FriendRequestStatus status;
}
