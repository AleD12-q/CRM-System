package org.example.controller;

import org.example.entity.User;
import org.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.security.Principal;

@Controller
public class MainController {

    @GetMapping("/register")
    public String showRegistrationForm() {
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