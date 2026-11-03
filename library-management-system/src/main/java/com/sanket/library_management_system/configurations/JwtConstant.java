package com.sanket.library_management_system.configurations;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtConstant {

    public static String JWT_HEADER;
    public static String JWT_SECRET;

    @Value("${jwt.header}")
    public void setJwtHeader(String header) {
        JWT_HEADER = header;
    }

    @Value("${jwt.secret}")
    public void setJwtSecret(String secret) {
        JWT_SECRET = secret;
    }
}