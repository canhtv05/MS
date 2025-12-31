package com.leaf.auth.util;

import com.leaf.auth.config.ApplicationProperties;
import com.leaf.auth.dto.CookieValue;
import com.leaf.common.utils.JsonF;
import com.leaf.framework.constant.CommonConstants;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
public class CookieUtil {

    @Getter
    private final ApplicationProperties properties;

    public Cookie setTokenCookie(String accessToken, String refreshToken) {
        CookieValue cookieValue = CookieValue.builder().accessToken(accessToken).refreshToken(refreshToken).build();

        String jsonData = JsonF.toJson(cookieValue);

        // replace các kí tự sao cho giống với thư viện js-cookie
        // https://www.npmjs.com/package/js-cookie
        String encode = URLEncoder.encode(jsonData, StandardCharsets.UTF_8);

        Cookie cookie = new Cookie(CommonConstants.COOKIE_NAME, encode);
        // cookie.setHttpOnly(true);

        // không cho phép lấy cookie từ phía client
        cookie.setHttpOnly(true);
        cookie.setMaxAge(properties.getSecurity().getRefreshDurationInSeconds().intValue()); // 2 weeks
        cookie.setPath("/");
        cookie.setSecure(false); // false for localhost development, true for production
        String domain = properties.getSecurity().getCookieDomain();
        if (StringUtils.hasText(domain)) cookie.setDomain(domain);

        return cookie;
    }

    public void deleteCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(CommonConstants.COOKIE_NAME, "");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setSecure(false); // false for localhost development, true for production
        String domain = properties.getSecurity().getCookieDomain();
        if (StringUtils.hasText(domain)) cookie.setDomain(domain);
        response.addCookie(cookie);
    }

    public CookieValue getTokenCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if (c.getName().equals(CommonConstants.COOKIE_NAME)) try {
                    String decoded = URLDecoder.decode(c.getValue(), StandardCharsets.UTF_8);

                    CookieValue cookieValue = JsonF.jsonToObject(decoded, CookieValue.class);
                    return cookieValue;
                } catch (Exception e) {
                    e.printStackTrace();
                    return null;
                }
            }
        }

        return null;
    }
}
