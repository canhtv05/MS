package com.leaf.post.service;

import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.security.SecurityUtils;
import com.leaf.post.domain.Post;
import com.leaf.post.dto.PostCreationReq;
import com.leaf.post.dto.PostResponse;
import com.leaf.post.repository.PostRepository;
// import profile.src.java.com.leaf.profile.repository.UserProfileRepository;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {

    PostRepository postRepository;

    // UserProfileRepository userProfileRepository;

    /* ================= CREATE POST ================= */

    public PostResponse createPost(PostCreationReq request) {
        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new ApiException(ErrorMessage.POST_CONTENT_EMPTY);
        }

        String username = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new ApiException(ErrorMessage.UNAUTHENTICATED)
        );

        String userId = userProfileRepository
            .findByUserIdReturnString(username)
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));

        Post post = postRepository.createPost(userId, request.getContent(), request.getVisibility().name());

        return PostResponse.from(post);
    }

    /* ================= GET MY POSTS ================= */

    public List<PostResponse> getMyPosts() {
        String username = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new ApiException(ErrorMessage.UNAUTHENTICATED)
        );

        String userId = userProfileRepository
            .findByUserIdReturnString(username)
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));

        return postRepository.findPostsByUserId(userId).stream().map(PostResponse::from).toList();
    }

    /* ================= DELETE POST ================= */

    public void deletePost(String postId) {
        String username = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new ApiException(ErrorMessage.UNAUTHENTICATED)
        );

        String userId = userProfileRepository
            .findByUserIdReturnString(username)
            .orElseThrow(() -> new ApiException(ErrorMessage.USER_PROFILE_NOT_FOUND));

        if (!postRepository.isOwner(userId, postId)) {
            throw new ApiException(ErrorMessage.ACCESS_DENIED);
        }

        postRepository.softDelete(postId).orElseThrow(() -> new ApiException(ErrorMessage.POST_NOT_FOUND));
    }
}
