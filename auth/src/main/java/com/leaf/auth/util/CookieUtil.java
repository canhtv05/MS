package com.leaf.auth.util;

import com.leaf.common.dto.TokenPairDTO;
import com.leaf.framework.blocking.util.CommonUtils;
import com.leaf.framework.blocking.util.JsonF;
import com.leaf.framework.config.ApplicationProperties;
import com.leaf.framework.constant.CommonConstants;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Getter
@Component
@RequiredArgsConstructor
public class CookieUtil {

    private final ApplicationProperties properties;

    public Cookie setTokenCookie(String accessToken, String refreshToken) {
        TokenPairDTO tokenPair = TokenPairDTO.builder().accessToken(accessToken).refreshToken(refreshToken).build();

        String jsonData = JsonF.toJson(tokenPair);
        if (CommonUtils.isEmpty(jsonData)) {
            return null;
        }

        // replace các kí tự sao cho giống với thư viện js-cookie
        // https://www.npmjs.com/package/js-cookie
        String encode = URLEncoder.encode(Objects.requireNonNull(jsonData), StandardCharsets.UTF_8);

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
}
