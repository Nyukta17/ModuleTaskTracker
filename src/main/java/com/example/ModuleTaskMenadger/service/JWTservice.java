package com.example.ModuleTaskMenadger.service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Service
public class JWTservice {

    private final SecretKey secretKey;
    private final long expirationTime = 3600000; // 1 час

    public JWTservice(@Value("${app.jwt.secret}") String secret) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String username, String role, Long companyId, Long userId){
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .claim("userId", userId)
                .claim("companyId", companyId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }
    public String generateTokenForRegistration(Map<String, Object> claims, Date expiryDate, Long companyId) {
        return Jwts.builder()
                .setClaims(claims)
                .claim("companyId",companyId)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }



    // Проверка валидности токена
    public boolean validateToken(String token, UserDetails userDetails){
        try {
            // Парсим токен, выбрасывает исключение если invalid
            Claims claims = Jwts.parser()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String usernameFromToken = claims.getSubject();
            Date expiration = claims.getExpiration();

            return (usernameFromToken.equals(userDetails.getUsername()) && expiration.after(new Date()));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    public boolean validateToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Date expiration = claims.getExpiration();
            return expiration.after(new Date()); // Проверка, что токен не истек
        } catch (JwtException | IllegalArgumentException e) {
            return false; // Токен невалидный
        }
    }


    // Извлечение username (subject) из токена
    public String extractUsername(String token){
        return extractAllClaims(token).getSubject();
    }

    // Извлечение companyId из токена
    public Long extractCompanyId(String token){
        Object claim = extractAllClaims(token).get("companyId");
        if (claim instanceof Integer) {
            return ((Integer) claim).longValue();
        } else if (claim instanceof Long) {
            return (Long) claim;
        }
        return null;
    }

    // Общий метод извлечения claims
    private Claims extractAllClaims(String token){
        return Jwts.parser()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
