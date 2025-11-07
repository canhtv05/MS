package com.leaf.common.constant;

import java.util.Arrays;

public class Constants {

    public static final String[] PUBLIC_ENDPOINTS = { "/me/p/authenticate", "/me/c/create" };

    public static final String[] PREFIX_PUBLIC_ENDPOINTS = Arrays.stream(PUBLIC_ENDPOINTS).map(res -> "/auth" + res)
            .toArray(String[]::new);

    public static final String COOKIE_NAME = "MY_MICROSERVICE";
}
