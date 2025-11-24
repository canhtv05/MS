package com.leaf.common.constant;

import java.util.Arrays;
import java.util.stream.Stream;

public class CommonConstants {

    public static final String[] AUTH_PUBLIC_ENDPOINTS = { "/me/p/authenticate", "/me/c/create" };
    public static final String[] NOTIFICATION_PUBLIC_ENDPOINTS = { "/verify-email" };

    public static final String[] PREFIX_AUTH_PUBLIC_ENDPOINTS = Arrays.stream(AUTH_PUBLIC_ENDPOINTS)
            .map(res -> "/auth" + res)
            .toArray(String[]::new);

    public static final String[] PREFIX_NOTIFICATION_PUBLIC_ENDPOINTS = Arrays.stream(NOTIFICATION_PUBLIC_ENDPOINTS)
            .map(res -> "/notifications" + res)
            .toArray(String[]::new);

    public static final String[] PREFIX_PUBLIC_ENDPOINTS = Stream.concat(
            Arrays.stream(PREFIX_AUTH_PUBLIC_ENDPOINTS),
            Arrays.stream(PREFIX_NOTIFICATION_PUBLIC_ENDPOINTS))
            .toArray(String[]::new);

    public static final String COOKIE_NAME = "MY_MICROSERVICE";
}
