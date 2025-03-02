package org.example.cs308project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.example.cs308project.service.register_service;
import org.example.cs308project.service.login_service;
import org.example.cs308project.service.workers_service;
import org.example.cs308project.model.register_model;
import org.example.cs308project.model.login_model;
import org.example.cs308project.model.workers_model;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class user_controller {

    @Autowired
    private register_service registerService;

    @Autowired
    private login_service loginService;

    @Autowired
    private workers_service workersService;

    // Register Endpoint (For Customers Only)
    @PostMapping("/register")
    public Map<String, String> register(@RequestBody register_model user) {
        Map<String, String> response = new HashMap<>();

        if (registerService.userExists(user.getUsername())) {
            response.put("message", "Username already taken!");
        } else {
            registerService.registerUser(user.getEmail(), user.getUsername(), user.getPassword());
            response.put("message", "User registered successfully!");
        }
        return response;
    }

    // Customer Login Endpoint
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody login_model loginUser) {
        Map<String, String> response = new HashMap<>();

        boolean isAuthenticated = loginService.authenticate(loginUser.getUsername(), loginUser.getPassword());

        if (isAuthenticated) {
            response.put("message", "Login successful");
        } else {
            response.put("message", "Invalid username or password");
        }
        return response;
    }


    // Worker Login Endpoint
    @PostMapping("/worker/login")
    public Map<String, String> workerLogin(@RequestBody login_model loginWorker) {
        Map<String, String> response = new HashMap<>();

        workers_model worker = workersService.findByUsername(loginWorker.getUsername());

        if (worker == null) {
            response.put("message", "Worker not found");
        } else if (!worker.getPassword().equals(loginWorker.getPassword())) {
            response.put("message", "Invalid password");
        } else {
            response.put("message", "Worker login successful");
        }
        return response;
    }
}
