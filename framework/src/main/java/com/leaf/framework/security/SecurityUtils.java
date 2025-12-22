package com.leaf.framework.security;

import java.util.Objects;
import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static Optional<String> getCurrentUserLogin() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(securityContext.getAuthentication())
            .map(SecurityUtils::extractPrincipal)
            .filter(Objects::nonNull);
    }

    private static String extractPrincipal(Authentication authentication) {
        if (authentication == null) {
            return null;
        } else if (authentication.getPrincipal() instanceof UserPrincipal springSecurityUser) {
            return springSecurityUser.getUsername();
        } else if (authentication.getPrincipal() instanceof String) {
            return (String) authentication.getPrincipal();
        } else if (Objects.nonNull(authentication.getName())) {
            return authentication.getName();
        }
        return null;
    }

    public static boolean isGlobalSuperAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (
            authentication != null &&
            authentication.getPrincipal() instanceof UserPrincipal &&
            ((UserPrincipal) authentication.getPrincipal()).isGlobal() &&
            ((UserPrincipal) authentication.getPrincipal()).getRole().contains(AuthoritiesConstants.SUPER_ADMIN)
        );
    }

    public static boolean isGlobalUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (
            authentication != null &&
            authentication.getPrincipal() instanceof UserPrincipal &&
            ((UserPrincipal) authentication.getPrincipal()).isGlobal()
        );
    }

    public static Optional<String> getCurrentUserChannel() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(securityContext.getAuthentication())
            .map(SecurityUtils::extractChannel)
            .filter(Objects::nonNull);
    }

    private static String extractChannel(Authentication authentication) {
        if (authentication == null) {
            return null;
        } else if (authentication.getPrincipal() instanceof UserPrincipal springSecurityUser) {
            return springSecurityUser.getChannel();
        }
        return null;
    }

    public static void clear() {
        SecurityContextHolder.clearContext();
    }
}
