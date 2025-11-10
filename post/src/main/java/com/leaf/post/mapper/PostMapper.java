package com.leaf.post.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.leaf.post.dto.req.PostCreationRequest;
import com.leaf.post.dto.res.PostResponse;
import com.leaf.post.entity.Post;

@Mapper(componentModel = "spring")
public interface PostMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "hashtags", ignore = true)
    @Mapping(target = "fileId", ignore = true)
    @Mapping(target = "reactionCounts", constant = "0L")
    @Mapping(target = "myReaction", ignore = true)
    Post toPost(PostCreationRequest request);

    PostResponse toPostResponse(Post post);
}
