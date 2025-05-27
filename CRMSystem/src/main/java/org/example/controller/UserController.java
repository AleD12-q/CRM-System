package org.example.controller;

import org.example.entity.Task;
import org.example.entity.User;
import org.example.model.TaskDTO;
import org.example.model.UserDTO;
import org.example.repository.TaskRepository;
import org.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping("/user-list")
    public ResponseEntity<List<UserDTO>> getUserList() {


        List<User> users = userRepository.findAll();
        List<UserDTO> userDtos = users.stream()
                .map(user -> new UserDTO(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getPosition(),
                        user.getDepartment()
                        ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(userDtos);
    }

    @GetMapping("/task-list")
    public ResponseEntity<List<TaskDTO>> getTaskList() {


        List<Task> tasks = taskRepository.findAll();
        List<TaskDTO> taskDTOS = tasks.stream()
                .map(task -> new TaskDTO(

                        task.getId(),
                        task.getTitle(),
                        task.getDescription(),
                        task.getHandler().getFullName(),
                        task.getDeadline(),
                        task.getStatus()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(taskDTOS);
    }

}

