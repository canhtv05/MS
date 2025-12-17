package com.leaf.common.utils;

import io.micrometer.common.util.StringUtils;
import java.util.stream.Stream;

public class CommonUtils {

    public static boolean isEmpty(String... values) {
        return Stream.of(values).anyMatch(StringUtils::isBlank);
    }
}
