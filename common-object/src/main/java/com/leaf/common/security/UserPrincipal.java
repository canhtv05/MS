package com.leaf.common.security;

public interface UserPrincipal {
    String getUsername();

    boolean isGlobal();

    String getRole();
}
