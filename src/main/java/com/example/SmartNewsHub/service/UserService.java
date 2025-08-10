package com.example.SmartNewsHub.service;

import com.example.SmartNewsHub.DTO.UserDTO;
import com.example.SmartNewsHub.model.Users;
import com.example.SmartNewsHub.repository.UserRepository;
import org.apache.catalina.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder =passwordEncoder;
    }

    public Users SingUp(UserDTO dto) {
        Users user = new Users();
        user.setEmail(dto.getEmail());
        user.setNickName(dto.getNickName());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole("lvl1");
        return userRepository.save(user);
    }
    public Users SingIn(UserDTO dto){
        Users user;
        if(dto.getEmail()!=null && !dto.getEmail().isEmpty()){
            user = userRepository.findByEmail(dto.getEmail()).orElseThrow(() -> new RuntimeException("Пользователь с таким email не найден"));
        }
        else if(dto.getNickName()!=null && !dto.getNickName().isEmpty()){
            user = userRepository.findBynickName(dto.getNickName()).orElseThrow(()->new RuntimeException("Пользователь с таким ником не найден"));
        }
        else{throw new RuntimeException("Нужно указать email или никнейм");}
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Неверный пароль");
        }
        return user;
    }

}
