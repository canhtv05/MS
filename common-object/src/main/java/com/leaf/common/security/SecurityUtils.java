package com.leaf.common.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static Optional<String> getCurrentUserLogin() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(extractPrincipal(securityContext.getAuthentication()));
    }

    private static String extractPrincipal(Authentication authentication) {
        if (authentication == null) {
            return null;
        } else if (authentication.getPrincipal() instanceof UserPrincipal springSecurityUser) {
            return springSecurityUser.getUsername();
        } else if (authentication.getPrincipal() instanceof String) {
            return (String) authentication.getPrincipal();
        }
        return null;
    }

    public static boolean isGlobalSuperAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (authentication != null &&
                authentication.getPrincipal() instanceof UserPrincipal &&
                ((UserPrincipal) authentication.getPrincipal()).isGlobal() &&
                ((UserPrincipal) authentication.getPrincipal()).getRole()
                        .contains(AuthoritiesConstants.SUPER_ADMIN));
    }

    public static boolean isGlobalUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (authentication != null &&
                authentication.getPrincipal() instanceof UserPrincipal &&
                ((UserPrincipal) authentication.getPrincipal()).isGlobal());
    }

    public static void clear() {
        SecurityContextHolder.clearContext();
    }
}
