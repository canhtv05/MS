package com.leaf.auth.context;

import java.util.Optional;

public class AuthenticationContext {

    private static final String DEFAULT_CHANNEL = "WEB";
    private static final ThreadLocal<String> channelContext = new ThreadLocal<>();

    public static void setChannel(String channel) {
        channelContext.set(channel);
    }

    public static String getChannel() {
        return Optional.ofNullable(channelContext.get()).orElse(DEFAULT_CHANNEL);
    }

    public static void clear() {
        channelContext.remove();
    }
}
