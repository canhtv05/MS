package com.leaf.post.service;

import com.leaf.post.common.ReactionType;
import com.leaf.post.dto.req.PostCreationRequest;
import com.leaf.post.dto.req.PostUpdateRequest;
import com.leaf.post.dto.res.PostListResponse;
import com.leaf.post.dto.res.PostResponse;
import org.springframework.web.multipart.MultipartFile;

public interface PostService {

    PostResponse createPost(PostCreationRequest request, MultipartFile[] files);

    PostResponse updatePost(String postId, PostUpdateRequest request);

    PostListResponse getPosts(Integer page, Integer size);

    PostResponse getPostById(String postId);

    void deletePost(String postId);

    PostResponse reactToPost(String postId, ReactionType reactionType);
}
