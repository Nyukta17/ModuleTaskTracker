package com.example.SmartNewsHub.service;

import com.example.SmartNewsHub.DTO.UserDTO;
import com.example.SmartNewsHub.repository.UserRepository;

public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void registerUser(UserDTO dto) {

    }
}
