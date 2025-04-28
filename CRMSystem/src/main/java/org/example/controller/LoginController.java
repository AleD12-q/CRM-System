package org.example.controller;

import org.example.model.LoginRequest;
import org.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private UserRepository userRepository;
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(
            @RequestBody LoginRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            UserController.currentEmail = request.getEmail();
            return ResponseEntity.ok(Map.of("message", "Успешный вход"));

        }

        return ResponseEntity.badRequest().body(
                Map.of("error", "Пользователь не найден")
        );

    }
}
