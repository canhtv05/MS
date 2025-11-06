package com.leaf.common.config;

import org.springframework.data.domain.AuditorAware;
import org.springframework.lang.NonNull;

import com.leaf.common.security.SecurityUtils;

import java.util.Optional;

public class AuditorAwareImpl implements AuditorAware<String> {

    @Override
    @NonNull
    public Optional<String> getCurrentAuditor() {
        return SecurityUtils.getCurrentUserLogin();
    }
}
