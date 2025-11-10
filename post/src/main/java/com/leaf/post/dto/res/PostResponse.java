package com.leaf.post.dto.res;

import com.leaf.post.common.ReactionType;
import com.leaf.post.common.Visibility;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostResponse implements Serializable {

    String id;
 //   String userId;
 String content;
    
    List<String> hashtags;
    String fileId;

    @Builder.Default
    Visibility visibility = Visibility.PUBLIC;
    ReactionType myReaction;

    @Builder.Default
    Long reactionCounts = 0L;
    Map<ReactionType, Long> reactionSummary;
}
