package com.leaf.common.utils;

import java.util.Arrays;
import org.apache.commons.lang3.ObjectUtils;

public class CommonUtils {

    public static boolean isEmpty(Object... args) {
        return Arrays.stream(args).anyMatch(ObjectUtils::isEmpty);
    }

    public static boolean isNotEmpty(Object... args) {
        return Arrays.stream(args).allMatch(ObjectUtils::isNotEmpty);
    }

    public static <T> T getSafeObject(Object obj, Class<T> clazz, T defaultValue) {
        return obj == null ? defaultValue : clazz.cast(obj);
    }
}
