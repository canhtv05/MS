package com.leaf.common.dto.event;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.leaf.common.utils.json.LowerCaseTrimDeserializer;
import jakarta.validation.constraints.NotBlank;
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
public class UserCreatedEvent {

    @JsonDeserialize(using = LowerCaseTrimDeserializer.class)
    @NotBlank(message = "UserId is required")
    String userId;

    String fullName;
}
