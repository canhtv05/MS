package com.leaf.post.controller;

import com.leaf.common.dto.ResponseObject;
import com.leaf.post.dto.PostCreationReq;
import com.leaf.post.dto.PostResponse;
import com.leaf.post.service.PostService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    /* ================= CREATE POST ================= */

    @PostMapping("/posts")
    public ResponseEntity<ResponseObject<PostResponse>> createPost(@RequestBody PostCreationReq request) {
        return ResponseEntity.ok(ResponseObject.success(postService.createPost(request)));
    }

    /* ================= GET MY POSTS ================= */

    @GetMapping("/posts/me")
    public ResponseEntity<ResponseObject<List<PostResponse>>> getMyPosts() {
        return ResponseEntity.ok(ResponseObject.success(postService.getMyPosts()));
    }

    /* ================= DELETE POST ================= */

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<ResponseObject<Void>> deletePost(@PathVariable String postId) {
        postService.deletePost(postId);
        return ResponseEntity.ok(ResponseObject.success(null));
    }
}
