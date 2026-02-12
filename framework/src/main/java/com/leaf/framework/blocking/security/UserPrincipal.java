package com.leaf.framework.blocking.security;

public interface UserPrincipal {
    String getUsername();

    boolean isGlobal();

    String getRole();

    String getChannel();
}
