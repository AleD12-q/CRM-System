package org.example.controller;

import lombok.extern.slf4j.Slf4j;
import org.example.entity.AccessKey;
import org.example.entity.User;
import org.example.model.LoginRequest;
import org.example.model.RegistrationRequest;
import org.example.repository.AccessKeyRepository;
import org.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class RegistrationController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AccessKeyRepository accessKeyRepository;
    @PostMapping(value = "/register")
    public ResponseEntity<Map<String, String>> registerUser(
            @RequestBody RegistrationRequest request) {


        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Email уже занят")
            );
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        UserController.currentEmail = request.getEmail();
        user.setPassword(request.getPassword());//TODO: Сделать сохранение хэш-кодом
        user.setPosition(request.getPosition());
        if(request.getPosition().equals("admin")){
            user.setDepartment("IT");
            Optional<AccessKey> accessKey = accessKeyRepository.findByKey(request.getPrivilegeKey());
            if(accessKey.isPresent() && accessKey.get().getHandler() == null){
                user.setPrivilegeLevel(accessKey.get().getLevel());
                accessKey.get().setHandler(user);
            }else{
                return ResponseEntity.badRequest().body(
                        Map.of("error", "Ключ недействителен или уже был использован!")
                );
            }
        } else {
            user.setDepartment(request.getDepartment());
        }
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Успешная регистрация"));
    }
}
