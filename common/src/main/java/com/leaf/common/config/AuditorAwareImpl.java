package com.leaf.common.config;

import com.leaf.common.security.SecurityUtils;
import java.util.Optional;
import org.springframework.data.domain.AuditorAware;
import org.springframework.lang.NonNull;

public class AuditorAwareImpl implements AuditorAware<String> {

    @Override
    @NonNull
    public Optional<String> getCurrentAuditor() {
        String username = "system";
        Optional<String> currentUser = SecurityUtils.getCurrentUserLogin().filter(s -> !s.isBlank());
        if (currentUser.isPresent()) {
            username = currentUser.get();
        }
        return Optional.of(username);
    }
}
