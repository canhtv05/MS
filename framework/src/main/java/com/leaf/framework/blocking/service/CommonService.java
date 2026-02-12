package com.leaf.framework.blocking.service;

import com.leaf.common.exception.ApiException;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.framework.blocking.security.SecurityUtils;
import lombok.experimental.UtilityClass;

@UtilityClass
public class CommonService {

    public String getCurrentUserLogin() {
        return SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new ApiException(ErrorMessage.UNAUTHENTICATED));
    }
}
