package com.leaf.auth.security;

import com.leaf.auth.context.AuthenticationContext;
import com.leaf.auth.domain.User;
import com.leaf.auth.dto.UserProfileDTO;
import com.leaf.auth.exception.CustomAuthenticationException;
import com.leaf.auth.service.AuthService;
import com.leaf.auth.service.KafkaProducerService;
import com.leaf.common.constant.EventConstants;
import com.leaf.common.dto.event.VerificationEmailEvent;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Authenticate a user from the database.
 */
@Component
@RequiredArgsConstructor
public class DomainUserDetailsService implements UserDetailsService {

    private final AuthService authService;
    private final KafkaProducerService kafkaProducerService;

    private static final String DEFAULT_CHANNEL = "WEB"; // Default channel nếu không có

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(final String login) {
        String lowercaseLogin = login.toLowerCase(Locale.ENGLISH);
        return authService
            .findOneWithAuthoritiesByUsername(lowercaseLogin)
            .map(user -> createSpringSecurityUser(lowercaseLogin, user))
            .orElseThrow(() ->
                new CustomAuthenticationException(
                    "User " + lowercaseLogin + " was not found in the database",
                    HttpStatus.UNAUTHORIZED
                )
            );
    }

    private CustomUserDetails createSpringSecurityUser(String lowercaseLogin, User user) {
        if (user.isLocked()) {
            throw new CustomAuthenticationException(
                "User " + lowercaseLogin + " was locked",
                HttpStatus.UNAUTHORIZED
            );
        }

        if (!user.isActivated()) {
            VerificationEmailEvent event = VerificationEmailEvent.builder()
                .username(lowercaseLogin)
                .to(user.getEmail())
                .build();
            kafkaProducerService.send(EventConstants.VERIFICATION_EMAIL_TOPIC, event);
            // todo
            throw new CustomAuthenticationException(
                "User " + lowercaseLogin + " was not activated",
                HttpStatus.UNAUTHORIZED
            );
        }

        // Lấy channel từ AuthenticationContext (ThreadLocal)
        String channel = getChannelFromContext();

        UserProfileDTO userProfileDTO = UserProfileDTO.fromEntity(user);
        authService.mappingUserPermissions(userProfileDTO, user);
        List<GrantedAuthority> grantedAuthorities = userProfileDTO
            .getPermissions()
            .stream()
            .map(SimpleGrantedAuthority::new)
            .collect(Collectors.toList());
        return new CustomUserDetails(
            user.getUsername(),
            user.getPassword(),
            grantedAuthorities,
            String.join(",", userProfileDTO.getRoles()),
            user.getIsGlobal(),
            channel
        );
    }

    /**
     * Lấy channel từ AuthenticationContext (ThreadLocal)
     * Channel được set từ controller trước khi authenticate
     */
    private String getChannelFromContext() {
        String channel = AuthenticationContext.getChannel();

        if (channel != null && !channel.isEmpty()) {
            return channel.toUpperCase();
        }

        return DEFAULT_CHANNEL;
    }
}
