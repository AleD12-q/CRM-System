package org.example.controller;

import lombok.extern.slf4j.Slf4j;
import org.example.config.SecurityManager;
import org.example.entity.AccessKey;
import org.example.entity.User;
import org.example.entity.enums.Privileges;
import org.example.repository.AccessKeyRepository;
import org.example.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.security.Principal;
@Slf4j
@Controller
public class MainController {

    private static final Logger log = LoggerFactory.getLogger(MainController.class);
    @Autowired
    private AccessKeyRepository accessKeyRepository;
    @GetMapping("/register")
    public String showRegistrationForm() {
        String accessKey = SecurityManager.createAccessKey(Privileges.VeryHigh);
        AccessKey accessKeyForAdmin = new AccessKey(accessKey, Privileges.VeryHigh, null);
        accessKeyRepository.save(accessKeyForAdmin);
        log.info(accessKey);
        return "Registration";
    }

    @GetMapping("/login")
    public String showLoginForm() {
        return "Login";
    }

    @GetMapping("/")
    public String showMainForm(){
        return "Main";
    }




}