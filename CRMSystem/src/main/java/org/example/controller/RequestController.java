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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class RequestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;
    @PostMapping(value = "/create-task")
    public ResponseEntity<Map<String, String>> createTask(
            @RequestBody TaskRequest request) {

        // Валидация данных
        if (request.getTaskTitle() == null || request.getTaskTitle().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Название задачи обязательно"));
        }

        if (request.getTaskAssignees() == null || request.getTaskAssignees().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Необходимо выбрать хотя бы одного исполнителя"));
        }

        List<User> users = userRepository.findAllById(request.getTaskAssignees());
        if (users.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Исполнители не найдены"));
        }

        // Создание задачи для каждого исполнителя
        List<Task> createdTasks = new ArrayList<>();
        for (User user : users) {
            Task newTask = new Task(
                    request.getTaskTitle(),
                    request.getTaskDescription(),
                    user,
                    request.getTaskDeadline()
            );
            createdTasks.add(taskRepository.save(newTask));
        }

        return ResponseEntity.ok(Map.of(
                "message", "Успешно создано задач: " + createdTasks.size(),
                "taskIds", createdTasks.stream()
                        .map(Task::getId)
                        .map(Object::toString)
                        .collect(Collectors.joining(","))
        ));
    }
}

