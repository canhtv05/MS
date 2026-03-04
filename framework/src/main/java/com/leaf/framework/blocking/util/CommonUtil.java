package com.leaf.framework.blocking.util;

import com.leaf.common.dto.TokenPairDTO;
import com.leaf.common.enums.AuthKey;
import com.leaf.framework.constant.CommonConstants;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.regex.Pattern;
import java.util.stream.Stream;
import lombok.experimental.UtilityClass;
import org.apache.commons.lang3.ObjectUtils;

@UtilityClass
public class CommonUtil {

    private static final Pattern NON_ALPHANUMERIC_PATTERN = Pattern.compile("[^A-Za-z0-9]+");

    public static boolean isEmpty(Object... args) {
        return Arrays.stream(args).anyMatch(ObjectUtils::isEmpty);
    }

    public static boolean isNotEmpty(Object... args) {
        return Arrays.stream(args).allMatch(ObjectUtils::isNotEmpty);
    }

    public static <T> T getSafeObject(Object obj, Class<T> clazz, T defaultValue) {
        return obj == null || (obj instanceof String && ((String) obj).trim().isEmpty())
            ? defaultValue
            : clazz.cast(obj);
    }

    public static String toSlug(String value) {
        return toSlug(value, "-");
    }

    public static String toSlug(String value, String separator) {
        if (ObjectUtils.isEmpty(value)) {
            return "";
        }

        String sep = Objects.requireNonNullElse(separator, "-");

        String normalized = NON_ALPHANUMERIC_PATTERN.matcher(value.trim()).replaceAll(sep);
        String collapsed = normalized.replaceAll(Pattern.quote(sep) + "+", sep);
        if (collapsed.startsWith(sep)) {
            collapsed = collapsed.substring(1);
        }
        if (collapsed.endsWith(sep)) {
            collapsed = collapsed.substring(0, collapsed.length() - 1);
        }

        return collapsed.toLowerCase(Locale.ROOT);
    }

    public static <T> void updateIfNotNull(T value, Consumer<T> setter) {
        if (isNotEmpty(value)) {
            setter.accept(value);
        }
    }

    public static Optional<TokenPairDTO> tokenFromCookie(String cookieHeader) {
        if (cookieHeader == null) {
            return Optional.empty();
        }
        String prefix = CommonConstants.COOKIE_NAME + "=";
        Optional<String> encodedOpt = Stream.of(cookieHeader.split(";"))
            .map(String::trim)
            .filter(s -> s.startsWith(prefix))
            .map(s -> s.substring(prefix.length()))
            .findFirst();

        if (encodedOpt.isEmpty()) {
            return Optional.empty();
        }

        try {
            String decoded = URLDecoder.decode(encodedOpt.get(), StandardCharsets.UTF_8);
            @SuppressWarnings("unchecked")
            Map<String, String> data = JsonF.jsonToObject(decoded, Map.class);
            if (data == null) {
                return Optional.empty();
            }
            String accessToken = data.get(AuthKey.ACCESS_TOKEN.getKey());
            String refreshToken = data.get(AuthKey.REFRESH_TOKEN.getKey());

            if (isNotEmpty(accessToken, refreshToken)) {
                return Optional.of(TokenPairDTO.builder().accessToken(accessToken).refreshToken(refreshToken).build());
            }
            return Optional.empty();
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
