package com.leaf.post.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.core.mapping.Document;

import com.leaf.post.common.ReactionType;
import com.leaf.post.common.Visibility;

import lombok.*;
// import org.springframework.data.annotation.CreatedDate;
// import org.springframework.data.annotation.Id;
// import org.springframework.data.annotation.LastModifiedDate;
// import org.springframework.data.mongodb.core.mapping.Document;

import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Document(collection = "posts")
@EnableMongoAuditing
public class Post {
  @Id
    String id; 
    String userId;
    String content;
    List<String> hashtags;
    String fileId;
    Visibility visibility;
    ReactionType myReaction;
    Long reactionCounts;
   // List<UserReaction> userReactions;

}
