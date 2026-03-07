package com.leaf.framework.blocking.security;

import com.nimbusds.jwt.SignedJWT;
import java.text.ParseException;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

/**
 * Blocking JWT decoder for Spring MVC applications.
 * Only loaded when spring-security-oauth2-resource-server is on classpath.
 */
@Component
@ConditionalOnClass(name = "org.springframework.security.oauth2.jwt.JwtDecoder")
public class CustomJwtDecoder implements JwtDecoder {

    @Override
    public Jwt decode(String token) throws JwtException {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);

            return new Jwt(
                token,
                signedJWT.getJWTClaimsSet().getIssueTime().toInstant(),
                signedJWT.getJWTClaimsSet().getExpirationTime().toInstant(),
                signedJWT.getHeader().toJSONObject(),
                signedJWT.getJWTClaimsSet().getClaims()
            );
        } catch (ParseException e) {
            throw new JwtException("Invalid token");
        }
    }
}
