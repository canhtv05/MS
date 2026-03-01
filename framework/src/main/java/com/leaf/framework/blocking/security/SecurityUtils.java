package com.leaf.framework.blocking.security;

import com.leaf.common.dto.UserSessionDTO;
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

    public static UserSessionDTO.AuthInfo getAuthInfo() {
        try {
            SecurityContext securityContext = SecurityContextHolder.getContext();
            Authentication authentication = securityContext.getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal principal) {
                return new UserSessionDTO.AuthInfo(principal.getChannel(), principal.getUsername());
            }
        } catch (Exception e) {
            //
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
