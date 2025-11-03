package com.canhtv05.auth.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.GenericFilterBean;

import com.canhtv05.auth.enums.AuthKey;
import com.canhtv05.auth.util.CookieUtil;

import java.io.IOException;
import java.util.Objects;

public class JWTFilter extends GenericFilterBean {

    private final TokenProvider tokenProvider;
    private final CookieUtil cookieUtil;

    public JWTFilter(TokenProvider tokenProvider, CookieUtil cookieUtil) {
        this.tokenProvider = tokenProvider;
        this.cookieUtil = cookieUtil;
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
        String jwt = resolveToken(httpServletRequest);
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

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        String jwt = request.getParameter(AuthKey.ACCESS_TOKEN.getKey());
        if (StringUtils.hasText(jwt)) {
            return jwt;
        }
        var res = cookieUtil.getTokenCookie(request);
        if (Objects.isNull(res))
            return null;

        return res.getAccessToken();
    }
}
