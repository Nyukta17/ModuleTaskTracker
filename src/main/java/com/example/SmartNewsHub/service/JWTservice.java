package com.example.SmartNewsHub.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JWTservice {

    private final SecretKey secretKey = Keys.hmacShaKeyFor("ОченьДлинныйСекретныйКлючДляПодписиJWT".getBytes());
    private final long expirationTime = 3600000;


    public String generateToken(String company, String role, Long id){
        return Jwts.builder()
                .setSubject(company)
                .claim("companyId",id)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(secretKey, SignatureAlgorithm.HS256) // Используйте SignatureAlgorithm из JJWT
                .compact();
    }
    public String generateRegistrationToken(Long companyId) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject("user_registration")
                .setExpiration(new Date(now + expirationTime))
                .claim("forUserReg", true)
                .claim("companyId", companyId)
                .setIssuedAt(new Date(now))
                .signWith(secretKey)
                .compact();
    }


    public boolean validateToken(String token){
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }


    public String getCompanyName(String token){
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }


    public String getRole(String token){
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.get("role", String.class);
    }
    public  Long getId(String token){
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.get("companyId", Long.class);
    }
}
