package com.leaf.framework.blocking.service;

import com.leaf.common.dto.UserSessionDTO;
import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.framework.blocking.security.SecurityUtils;
import lombok.experimental.UtilityClass;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

@UtilityClass
public class CommonService {

    public String getCurrentUserLogin() {
        return SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new ApiException(ErrorMessage.UNAUTHENTICATED));
    }

    public UserSessionDTO.AuthInfo getAuthInfo() {
        return SecurityUtils.getAuthInfo();
    }
}
