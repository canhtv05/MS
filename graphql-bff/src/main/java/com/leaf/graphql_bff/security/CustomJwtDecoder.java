package com.leaf.graphql_bff.security;

import com.nimbusds.jwt.SignedJWT;
import java.text.ParseException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class CustomJwtDecoder implements ReactiveJwtDecoder {

    @Override
    public Mono<Jwt> decode(String token) throws JwtException {
        return Mono.fromCallable(() -> {
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
        });
    }
}
