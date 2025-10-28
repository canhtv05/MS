package com.canhtv05.common.utils;

import java.util.stream.Stream;

import io.micrometer.common.util.StringUtils;

public class CommonUtils {

    public static boolean isEmpty(String... values) {
        return Stream.of(values).anyMatch(StringUtils::isBlank);
    }
}
