package com.talentshare.backend.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String SECRET_KEY_STRING;
    @Value("${jwt.expiration}")
    private long EXPIRATION_MS;
    @Value("${jwt.refresh.expiration}")
    private long REFRESH_TOKEN_EXPIRATION_MS;

    private Key SECRET_KEY;
    private Key REFRESH_SECRET_KEY;

    @PostConstruct
    public void init() {
        // Convert Base64 string to proper Key object
        this.SECRET_KEY = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes(StandardCharsets.UTF_8));
        System.out.println("JWT Secret initialized. Key length: " + SECRET_KEY_STRING.length());
        // Different secret for refresh tokens (append '-refresh' to base secret)
        this.REFRESH_SECRET_KEY = Keys.hmacShaKeyFor(
                (SECRET_KEY_STRING + "-refresh").getBytes(StandardCharsets.UTF_8)
        );
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }
    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION_MS))
                .signWith(REFRESH_SECRET_KEY, SignatureAlgorithm.HS256) // Different key
                .compact();
    }

    public boolean validateRefreshToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(REFRESH_SECRET_KEY)
                    .build()
                    .parseClaimsJws(token);// Cette ligne lève une exception si le token est expiré
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (JwtException e) {
            return false;
        }
    }
    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }
//    public String extractUsername(String token) {
//        try {
//            return extractClaimsRefreshToken(token).getSubject();
//        } catch (JwtException e) {
//            return extractClaims(token).getSubject();
//        }
//    }
public String extractUsername(String token) {
    if (token == null || !token.contains(".") || token.split("\\.").length != 3) {
        throw new MalformedJwtException("Token malformed or empty: " + token);
    }
    try {
        return extractClaimsRefreshToken(token).getSubject();
    } catch (JwtException e1) {
        try {
            return extractClaims(token).getSubject();
        } catch (ExpiredJwtException e2) {
            return null; // token expiré : retourne null proprement
        }
    }
}

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }
    private Claims extractClaimsRefreshToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(REFRESH_SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    public Key getRefreshSecretKey() {
        return REFRESH_SECRET_KEY;
    }
}


