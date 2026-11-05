
package com.sanket.library_management_system.configurations;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Component
public class JwtProvider {

    private final SecretKey key;

    public JwtProvider(@Value("${jwt.secret}") String jwtSecret) {
        this.key = Keys.hmacShaKeyFor(
                jwtSecret.getBytes(StandardCharsets.UTF_8)
        );
    }

    public String generateToken(Authentication authentication) {

        Collection<? extends GrantedAuthority> authorities =
                authentication.getAuthorities();

        String roles = populateAuthorities(authorities);

        long currentTime = System.currentTimeMillis();

        return Jwts.builder()
                .subject(authentication.getName())
                .issuedAt(new Date(currentTime))
                .expiration(new Date(currentTime + 86400000))
                .claim("authorities", roles)
                .signWith(key)
                .compact();
    }

    public String getEmailFromJwtToken(String jwt) {

        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(jwt)
                .getPayload();

        return claims.getSubject();
    }

    private String populateAuthorities(
            Collection<? extends GrantedAuthority> authorities) {

        Set<String> auths = new HashSet<>();

        for (GrantedAuthority authority : authorities) {
            auths.add(authority.getAuthority());
        }

        return String.join(",", auths);
    }
}
