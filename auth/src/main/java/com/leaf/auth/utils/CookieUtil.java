package com.leaf.auth.utils;

import com.leaf.auth.config.ApplicationProperties;
import com.leaf.auth.dto.CookieValue;
import com.leaf.common.constant.ConstantCookie;
import com.leaf.common.utils.JsonF;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CookieUtil {

    @Getter
    private final ApplicationProperties properties;

    public Cookie setTokenCookie(String accessToken, String refreshToken) {
        CookieValue cookieValue = CookieValue.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();

        String jsonData = JsonF.toJson(cookieValue);

        // replace các kí tự sao cho giống với thư viện js-cookie
        // https://www.npmjs.com/package/js-cookie
        String encode = URLEncoder.encode(jsonData, StandardCharsets.UTF_8);

        Cookie cookie = new Cookie(ConstantCookie.COOKIE_NAME, encode);
        // cookie.setHttpOnly(true);

        // cho phép lấy cookie từ phía client
        cookie.setHttpOnly(false);
        cookie.setMaxAge(properties.getSecurity().getRefreshDurationInSeconds().intValue()); // 2 weeks
        cookie.setPath("/");
        cookie.setSecure(true); // true nếu chỉ cho gửi qua HTTPS
        cookie.setDomain("localhost");
        return cookie;
    }

    public void deleteCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(ConstantCookie.COOKIE_NAME, "");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setSecure(true);
        cookie.setDomain("localhost");
        response.addCookie(cookie);
    }

    public CookieValue getTokenCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if (c.getName().equals(ConstantCookie.COOKIE_NAME))
                    try {
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
