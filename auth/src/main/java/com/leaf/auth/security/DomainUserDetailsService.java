package com.leaf.auth.security;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.leaf.auth.domain.User;
import com.leaf.auth.dto.UserProfileDTO;
import com.leaf.auth.exception.CustomAuthenticationException;
import com.leaf.auth.service.AuthService;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

/**
 * Authenticate a user from the database.
 */
@Component
@RequiredArgsConstructor
public class DomainUserDetailsService implements UserDetailsService {

    private final AuthService authService;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(final String login) {
        String lowercaseLogin = login.toLowerCase(Locale.ENGLISH);
        return authService.findOneWithAuthoritiesByUsername(lowercaseLogin)
                .map(user -> createSpringSecurityUser(lowercaseLogin, user))
                .orElseThrow(() -> new CustomAuthenticationException(
                        "User " + lowercaseLogin + " was not found in the database",
                        HttpStatus.UNAUTHORIZED));
    }

    private CustomUserDetails createSpringSecurityUser(String lowercaseLogin, User user) {
        if (!user.isActivated()) {
            throw new CustomAuthenticationException("User " + lowercaseLogin + " was not activated",
                    HttpStatus.UNAUTHORIZED);
        }
        UserProfileDTO userProfileDTO = UserProfileDTO.fromEntity(user);
        authService.mappingUserPermissions(userProfileDTO, user);
        List<GrantedAuthority> grantedAuthorities = userProfileDTO.getPermissions().stream()
                .map(SimpleGrantedAuthority::new).collect(Collectors.toList());
        return new CustomUserDetails(
                user.getUsername(),
                user.getPassword(),
                grantedAuthorities,
                String.join(",", userProfileDTO.getRoles()),
                user.getIsGlobal());
    }

}
