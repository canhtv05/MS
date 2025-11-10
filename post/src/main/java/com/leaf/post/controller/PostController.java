package com.leaf.post.controller;

import com.leaf.post.common.ReactionType;
import com.leaf.post.dto.req.PostCreationRequest;
import com.leaf.post.dto.req.PostUpdateRequest;
import com.leaf.post.dto.res.PostListResponse;
import com.leaf.post.dto.res.PostResponse;
import com.leaf.post.service.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostController {

    PostService postService;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public PostResponse createPost(@ModelAttribute PostCreationRequest request,
                                   @RequestPart(required = false) MultipartFile[] files) {
        return postService.createPost(request, files);
    }

    @GetMapping
    public PostListResponse getAllPosts(@RequestParam(defaultValue = "1") Integer page,
                                        @RequestParam(defaultValue = "10") Integer size) {
        return postService.getPosts(page, size);
    }

    @GetMapping("/{postId}")
    public PostResponse getPostById(@PathVariable String postId) {
        return postService.getPostById(postId);
    }

    @PutMapping("/{postId}")
    public PostResponse updatePost(@PathVariable String postId,
                                   @RequestBody PostUpdateRequest request) {
        return postService.updatePost(postId, request);
    }

    @DeleteMapping("/{postId}")
    public void deletePost(@PathVariable String postId) {
        postService.deletePost(postId);
    }

    @PutMapping("/reaction/{postId}")
    public PostResponse reactToPost(@PathVariable String postId,
                                    @RequestParam ReactionType reactionType) {
        return postService.reactToPost(postId, reactionType);
    }
}
