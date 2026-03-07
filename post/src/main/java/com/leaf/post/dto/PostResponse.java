package com.leaf.post.dto;

import com.leaf.post.domain.Post;
import com.leaf.post.enums.ReactionType;
import com.leaf.post.enums.Visibility;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PostResponse {

    String id;
    String content;
    Visibility visibility;
    String createdDate;

    public static PostResponse from(Post post) {
        return PostResponse.builder()
            .id(post.getId())
            .content(post.getContent())
            .visibility(post.getVisibility())
            .createdDate(post.getCreatedDate().toString())
            .build();
    }
}
