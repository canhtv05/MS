package com.leaf.auth.util;

import java.util.Objects;

import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.leaf.common.enums.AuthKey;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthUtil {

    CookieUtil cookieUtil;

    public String resolveToken(HttpServletRequest request) {
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
