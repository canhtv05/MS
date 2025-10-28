package com.canhtv05.common.security;

public interface UserPrincipal {
    String getUsername();

    boolean isGlobal();

    String getRole();
}
