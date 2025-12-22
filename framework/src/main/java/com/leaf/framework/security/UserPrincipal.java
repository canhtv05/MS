package com.leaf.framework.security;

public interface UserPrincipal {
    String getUsername();

    boolean isGlobal();

    String getRole();

    String getChannel();
}
