
package com.sanket.library_management_system.configurations;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.List;

@Component
public class JwtValidator extends OncePerRequestFilter {

    @Value("${jwt.header:Authorization}")
    private String jwtHeader;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Override
    protected void doFilterInternal(
            HttpServletRequest req,
            HttpServletResponse res,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String jwt = req.getHeader(jwtHeader);

        if (jwt != null && jwt.startsWith("Bearer ")) {

            jwt = jwt.substring(7);

            try {
                SecretKey key = Keys.hmacShaKeyFor(
                        jwtSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8)
                );

                Claims claims = Jwts.parser()
                        .verifyWith(key)
                        .build()
                        .parseSignedClaims(jwt)
                        .getPayload();

                String authorities = claims.get("authorities", String.class);

                List<GrantedAuthority> authorityList =
                        AuthorityUtils.commaSeparatedStringToAuthorityList(
                                authorities == null ? "" : authorities
                        );

                String email = claims.getSubject();

                Authentication auth =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                authorityList
                        );

                ((UsernamePasswordAuthenticationToken) auth)
                        .setDetails(
                                new WebAuthenticationDetailsSource()
                                        .buildDetails(req)
                        );

                SecurityContextHolder.getContext()
                        .setAuthentication(auth);

            } catch (Exception e) {
                SecurityContextHolder.clearContext();
                throw new BadCredentialsException("Invalid JWT Token!", e);
            }
        }

        filterChain.doFilter(req, res);
    }
}
