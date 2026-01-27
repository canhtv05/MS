package com.leaf.auth.security.jwt;

import com.leaf.auth.util.CookieUtil;
import com.leaf.common.enums.TokenStatus;
import com.leaf.framework.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.GenericFilterBean;

public class JWTFilter extends GenericFilterBean {

    private final TokenProvider tokenProvider;
    private final CookieUtil cookieUtil;
    private final JwtUtil jwtUtil;

    public JWTFilter(TokenProvider tokenProvider, CookieUtil cookieUtil, JwtUtil jwtUtil) {
        this.tokenProvider = tokenProvider;
        this.cookieUtil = cookieUtil;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
        throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
        String path = httpServletRequest.getRequestURI();

        if (path.startsWith("/ws")) {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        String jwt = null;
        String authHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
        } else {
            var tokenPair = cookieUtil.getTokenCookie(httpServletRequest);
            if (tokenPair != null) {
                jwt = tokenPair.getAccessToken();
            }
        }

        if (StringUtils.hasText(jwt) && TokenStatus.VALID.equals(jwtUtil.validateToken(jwt))) {
            Authentication authentication = this.tokenProvider.getAuthentication(jwt);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }
}
