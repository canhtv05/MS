package com.leaf.common.utils;

import java.util.Arrays;
import java.util.Locale;
import java.util.Objects;
import java.util.function.Consumer;
import java.util.regex.Pattern;
import org.apache.commons.lang3.ObjectUtils;

public class CommonUtils {

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
        if (CommonUtils.isNotEmpty(value)) {
            setter.accept(value);
        }
    }
}
