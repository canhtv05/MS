package com.leaf.graphql_bff.util;

import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import reactor.core.publisher.Mono;

public class SecurityUtils {

    public static Mono<String> getCurrentUserLogin() {
        return ReactiveSecurityContextHolder.getContext()
            .map(SecurityContext::getAuthentication)
            .filter(auth -> auth != null && auth.isAuthenticated())
            .map(Authentication::getName)
            .switchIfEmpty(Mono.error(new ApiException(ErrorMessage.UNAUTHENTICATED)));
    }
}
