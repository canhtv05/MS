package com.leaf.post.dto.req;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

import com.leaf.post.enums.Visibility;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostUpdateRequest implements Serializable {

    @NotBlank
    String content;

    @Builder.Default
    Visibility visibility = Visibility.PUBLIC;
}
