package com.leaf.post.service;

import com.leaf.post.dto.req.PostCreationRequest;
import com.leaf.post.dto.res.PostResponse;
import com.leaf.post.entity.Post;
import com.leaf.post.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public PostResponse createPost(PostCreationRequest request) {
        Post post = new Post();
        post.setContent(request.getContent());
        post.setReactionCounts(0L);
        post.setHashtags(null);

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
