package com.leaf.auth.controller;

import com.leaf.auth.dto.UserProfileDTO;
import com.leaf.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class UserGraphQLController {

    private final AuthService authService;

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public UserProfileDTO me() {
        return authService.getProfile();
    }
}
