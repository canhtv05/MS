package com.leaf.post.service;

import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.security.SecurityUtils;
import com.leaf.post.dto.req.PostCreationRequest;
import com.leaf.post.dto.res.PostResponse;
import com.leaf.post.entity.Post;
import com.leaf.post.repository.PostRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public PostResponse createPost(PostCreationRequest request) {
        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new ApiException(ErrorMessage.UNAUTHENTICATED));
        Post post = new Post();
        post.setContent(request.getContent());
        post.setReactionCounts(0L);
        post.setHashtags(null);
        post.setUserId(username);

        postRepository.save(post);
        return toPostResponse(post);
    }

    public List<PostResponse> getAllPosts() {
        return postRepository.findAll()
                .stream()
                .map(this::toPostResponse)
                .collect(Collectors.toList());
    }

    private PostResponse toPostResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setContent(post.getContent());
        response.setReactionCounts(post.getReactionCounts());
        return response;
    }
}
