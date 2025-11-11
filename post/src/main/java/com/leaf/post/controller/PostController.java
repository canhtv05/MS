package com.leaf.post.controller;

import com.leaf.post.dto.req.PostCreationRequest;
import com.leaf.post.dto.res.PostResponse;
import com.leaf.post.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping
    public PostResponse createPost(@RequestBody PostCreationRequest request) {
        return postService.createPost(request);
    }

    @GetMapping
    public List<PostResponse> getAllPosts() {
        return postService.getAllPosts();
    }
}
