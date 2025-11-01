package com.canhtv05.auth.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.GenericFilterBean;

import com.canhtv05.auth.enums.AuthKey;
import com.canhtv05.common.utils.JsonF;

import java.io.IOException;
import java.util.Map;

public class JWTFilter extends GenericFilterBean {

    private final String name;
    private final TokenProvider tokenProvider;

    public JWTFilter(TokenProvider tokenProvider, String name) {
        this.tokenProvider = tokenProvider;
        this.name = name;
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
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if (c.getName().equals(this.name))
                    try {
                        String decoded = java.net.URLDecoder.decode(c.getValue(),
                                java.nio.charset.StandardCharsets.UTF_8);

                        Map<String, String> tokenData = JsonF.jsonToObject(decoded, Map.class);

                        return tokenData.get(AuthKey.ACCESS_TOKEN.getKey());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
            }
        }
        return null;
    }
}
