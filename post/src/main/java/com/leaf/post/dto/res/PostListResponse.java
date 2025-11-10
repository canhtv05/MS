package com.leaf.post.dto.res;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostListResponse implements Serializable {

    List<PostResponse> data;
    long totalElements;
    int totalPages;
}
