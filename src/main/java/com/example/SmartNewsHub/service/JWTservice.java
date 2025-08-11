package com.example.SmartNewsHub.service;

import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.util.Date;
@Service
public class JWTservice {
    // Секретный ключ — желательно загружать из настроек
    private final SecretKey secretKey = Keys.hmacShaKeyFor("ОченьДлинныйСекретныйКлючДляПодписиJWT".getBytes());
    private final long expirationTime = 3600000;

    public String generateToken(String nickName,String role){
        return Jwts.builder()
                .setSubject(nickName)
                .claim("role",role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+ expirationTime))
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

}
