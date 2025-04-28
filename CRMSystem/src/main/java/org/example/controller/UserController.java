package org.example.controller;

import org.example.entity.User;
import org.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Controller
public class UserController {
    @Autowired
    private UserRepository userRepository;

    public static String currentEmail = "";



    @GetMapping("/personal-account")
    public String showPersonalAccountForm(Model model, Principal principal) {
/*
        if (principal == null) {
            return "redirect:/login";
        }

*/
        if (currentEmail.isEmpty()){
            return "redirect:/login";
        }
        Optional<User> userOptional = userRepository.findByEmail(currentEmail);

        if (userOptional.isEmpty()) {
            return "redirect:/error?message=User not found";
        }

        User user = userOptional.get();
        model.addAttribute("user", user);
        return "PersonalAccount";
    }

}

