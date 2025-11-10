package com.leaf.post.service.impl;

import com.leaf.post.common.ReactionType;
import com.leaf.post.dto.req.PostCreationRequest;
import com.leaf.post.dto.req.PostUpdateRequest;
import com.leaf.post.dto.res.PostListResponse;
import com.leaf.post.dto.res.PostResponse;
import com.leaf.post.entity.Post;
import com.leaf.post.mapper.PostMapper;
import com.leaf.post.repository.PostRepository;
import com.leaf.post.service.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostServiceImpl implements PostService {

    PostRepository postRepository;
    PostMapper postMapper;

    @Override
    public PostResponse createPost(PostCreationRequest request, MultipartFile[] files) {
        Post post = postMapper.toPost(request);
        post.setHashtags(extractHashtags(request.getContent()));
        post = postRepository.save(post);
        return postMapper.toPostResponse(post);
    }

    @Override
    public PostResponse updatePost(String postId, PostUpdateRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setContent(request.getContent());
        post.setVisibility(request.getVisibility());
        post.setHashtags(extractHashtags(request.getContent()));
        postRepository.save(post);
        return postMapper.toPostResponse(post);
    }

    @Override
    public PostListResponse getPosts(Integer page, Integer size) {
        var pageable = PageRequest.of(page - 1, size);
        var result = postRepository.findAll(pageable);
        var responses = result.getContent().stream()
                .map(postMapper::toPostResponse)
                .collect(Collectors.toList());

        return PostListResponse.builder()
                .data(responses)
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

    @Override
    public PostResponse getPostById(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return postMapper.toPostResponse(post);
    }

    @Override
    public void deletePost(String postId) {
        postRepository.deleteById(postId);
    }

    @Override
    public PostResponse reactToPost(String postId, ReactionType reactionType) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setMyReaction(reactionType);
        post.setReactionCounts(
                post.getReactionCounts() == null ? 1 : post.getReactionCounts() + 1
        );

        postRepository.save(post);
        return postMapper.toPostResponse(post);
    }

    private List<String> extractHashtags(String content) {
        if (content == null) return Collections.emptyList();
        return Arrays.stream(content.split("\\s+"))
                .filter(word -> word.startsWith("#") && word.length() > 1)
                .collect(Collectors.toList());
    }
}
