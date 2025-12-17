package com.leaf.auth.security.jwt;

import com.leaf.auth.util.AuthUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.GenericFilterBean;

public class JWTFilter extends GenericFilterBean {

    private final TokenProvider tokenProvider;
    private final AuthUtil authUtil;

    public JWTFilter(TokenProvider tokenProvider, AuthUtil authUtil) {
        this.tokenProvider = tokenProvider;
        this.authUtil = authUtil;
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
        throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
        String jwt = authUtil.resolveToken(httpServletRequest);
        String path = httpServletRequest.getRequestURI();

        if (path.startsWith("/ws")) {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        if (StringUtils.hasText(jwt) && this.tokenProvider.validateToken(jwt)) {
            Authentication authentication = this.tokenProvider.getAuthentication(jwt);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }
}
