package org.example.controller;

import org.example.entity.Task;
import org.example.entity.User;
import org.example.model.RegistrationRequest;
import org.example.model.TaskRequest;
import org.example.repository.TaskRepository;
import org.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class RequestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;
    @PostMapping(value = "/create-task")
    public ResponseEntity<Map<String, String>> registerUser(
            @RequestBody TaskRequest request) {

        if (request.getTaskTitle() == null || request.getTaskTitle().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Название задачи обязательно"));
        }

        Optional<User> user = userRepository.findById(request.getTaskAssignee());
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Исполнитель не найден"));
        }

            // Создание задачи
        Task newTask = new Task(
                request.getTaskTitle(),
                request.getTaskDescription(),
                user.get(),
                request.getTaskDeadline()
        );
        taskRepository.save(newTask);
        return ResponseEntity.ok(Map.of("message", "Успешно!"));
    }
}

