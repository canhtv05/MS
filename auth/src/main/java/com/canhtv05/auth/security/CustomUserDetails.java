package com.canhtv05.auth.security;

import com.canhtv05.common.security.UserPrincipal;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

@Getter
public class CustomUserDetails extends User implements UserPrincipal {

    private final String role;
    private final boolean isGlobal;

    public CustomUserDetails(String username,
            String password,
            Collection<? extends GrantedAuthority> authorities,
            String roles,
            boolean isGlobal) {
        super(username, password, authorities);
        this.role = roles;
        this.isGlobal = isGlobal;
    }

    @Override
    public String getUsername() {
        return super.getUsername();
    }

    @Override
    public boolean isGlobal() {
        return this.isGlobal;
    }

    @Override
    public String getRole() {
        return this.role;
    }
}
