package com.canhtv05.auth.security.jwt;

import com.canhtv05.auth.dto.PermissionSelect;
import com.canhtv05.auth.exceptions.CustomAuthenticationException;
import com.canhtv05.auth.security.CustomUserDetails;
import com.canhtv05.auth.service.PublicApiService;
import com.canhtv05.common.security.SecurityUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;

@Component
@RequiredArgsConstructor
@Slf4j
public class PermissionAuthorizationFilter extends OncePerRequestFilter {

    private static final AntPathMatcher pathMatcher = new AntPathMatcher();
    private final PublicApiService service;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Ghi vào MDC
            MDC.put("traceId", UUID.randomUUID().toString());

            if (isPublicEndpoint(request)) {
                filterChain.doFilter(request, response);
                return;
            }

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
                throw new CustomAuthenticationException("Unauthorized", HttpStatus.UNAUTHORIZED);
            }
            String path = request.getRequestURI();
            String method = request.getMethod();
            // Validate permission
            this.validatePermission(method, path, userDetails);

            filterChain.doFilter(request, response);
        } finally {
            MDC.clear();
        }
    }

    private void validatePermission(String method, String path, CustomUserDetails userDetails) {
        if (path.startsWith("/api/user-profile") || path.startsWith("/api/p")) {
            return;
        }
        if (SecurityUtils.isGlobalSuperAdmin()) {
            return;
        }
        List<PermissionSelect> permissions = service.getPermissionSelect();
        AtomicBoolean hasPermission = new AtomicBoolean(false);
        userDetails.getAuthorities().forEach(authority -> {
            PermissionSelect permission = permissions.stream()
                    .filter(p -> p.code().equalsIgnoreCase(authority.getAuthority())).findFirst().orElse(null);
            if (permission != null && match(permission.method(), permission.pathPattern(), method, path)) {
                hasPermission.set(true);
            }
        });
        if (!hasPermission.get()) {
            log.error("User {} does not have permission to access {} on {}", userDetails.getUsername(), method, path);
            throw new CustomAuthenticationException("Missing permission!", HttpStatus.FORBIDDEN);
        }
    }

    private boolean isPublicEndpoint(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/auth/authenticate") || path.startsWith("/ws/");
    }

    /**
     * Kiểm tra quyền có khớp với API đang gọi không
     *
     * @param permissionMethod - phương thức HTTP cần kiểm tra, ví dụ: GET, POST,
     *                         PUT,... hoặc rỗng để bỏ qua
     * @param permissionPath   - pathPattern, ví dụ: /api/admin/permission/**
     * @param requestMethod    - phương thức thực tế được gọi (từ
     *                         HttpServletRequest)
     * @param requestPath      - path thực tế được gọi (từ HttpServletRequest)
     * @return true nếu khớp cả method lẫn pathPattern
     */
    public static boolean match(String permissionMethod, String permissionPath, String requestMethod,
            String requestPath) {
        boolean methodMatch = permissionMethod == null || permissionMethod.isEmpty()
                || permissionMethod.equalsIgnoreCase(requestMethod);
        boolean pathMatch = pathMatcher.match(permissionPath, requestPath);
        return methodMatch && pathMatch;
    }
}