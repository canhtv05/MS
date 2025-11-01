package com.canhtv05.auth.util;

import com.canhtv05.auth.config.ApplicationProperties;
import com.canhtv05.auth.enums.AuthKey;
import com.canhtv05.common.utils.JsonF;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CookieUtil {

    @Getter
    private final ApplicationProperties properties;

    public Cookie setCookie(String accessToken, String refreshToken) {
        Map<String, String> tokenData = new HashMap<>();
        tokenData.put(AuthKey.ACCESS_TOKEN.getKey(), accessToken);
        tokenData.put(AuthKey.REFRESH_TOKEN.getKey(), refreshToken);

        String jsonData = JsonF.toJson(tokenData);

        // replace các kí tự sao cho giống với thư viện js-cookie
        // https://www.npmjs.com/package/js-cookie
        String encode = java.net.URLEncoder.encode(jsonData,
                java.nio.charset.StandardCharsets.UTF_8);

        Cookie cookie = new Cookie(properties.getName(), encode);
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
        Cookie cookie = new Cookie(properties.getName(), "");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setSecure(true);
        cookie.setDomain("localhost");
        response.addCookie(cookie);
    }
}
