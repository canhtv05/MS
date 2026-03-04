package com.leaf.profile.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.leaf.framework.blocking.util.json.InstantToStringSerializer;
import com.leaf.profile.enums.FriendRequestStatus;
import jakarta.validation.constraints.NotBlank;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SendFriendRequestDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    String senderName;

    @NotBlank(message = "Receiver Name is required")
    String receiverName;

    @JsonSerialize(using = InstantToStringSerializer.class)
    Instant sendAt;

    FriendRequestStatus status;
}
