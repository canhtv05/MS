package com.leaf.auth.security;

import com.leaf.common.security.UserPrincipal;
import java.util.Collection;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

@Getter
public class CustomUserDetails extends User implements UserPrincipal {

    private final String role;
    private final boolean isGlobal;
    private final String channel;

    public CustomUserDetails(
        String username,
        String password,
        Collection<? extends GrantedAuthority> authorities,
        String roles,
        boolean isGlobal,
        String channel
    ) {
        super(username, password, authorities);
        this.role = roles;
        this.isGlobal = isGlobal;
        this.channel = channel;
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

    @Override
    public String getChannel() {
        return this.channel;
    }
}
