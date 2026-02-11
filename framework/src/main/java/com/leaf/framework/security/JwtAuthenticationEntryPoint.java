package com.leaf.framework.security;

import com.leaf.common.dto.ResponseObject;
import com.leaf.common.exception.ErrorMessage;
import com.leaf.common.utils.JsonF;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(
        HttpServletRequest request,
        HttpServletResponse response,
        AuthenticationException authException
    ) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ResponseObject<?> apiResponse = ResponseObject.builder()
            .code(String.valueOf(HttpStatus.UNAUTHORIZED.value()))
            .message(ErrorMessage.UNAUTHENTICATED.getMessage())
            .build();

        response.getWriter().write(JsonF.toJson(apiResponse));
        response.flushBuffer();
    }
}
