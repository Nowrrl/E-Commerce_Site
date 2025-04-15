package org.example.cs308project.loginregister.controller;

import org.example.cs308project.loginregister.model.login_model;
import org.example.cs308project.loginregister.model.register_model;
import org.example.cs308project.loginregister.model.workers_model;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.example.cs308project.loginregister.service.register_service;
import org.example.cs308project.loginregister.service.login_service;
import org.example.cs308project.loginregister.service.workers_service;

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

        if (registerService.userNameExists(user.getUsername())) {
            response.put("message", "Username already taken!");
        }
        else if(registerService.userMailExists(user.getEmail())){
            response.put("message", " This Email already exists!");

        }else {
            registerService.registerUser(user.getEmail(), user.getUsername(), user.getPassword());
            response.put("message", "User registered successfully!");
        }
        return response;
    }

    // Customer Login Endpoint
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody login_model loginUser) {
        Map<String, Object> response = new HashMap<>();

        boolean isAuthenticated = loginService.authenticate(loginUser.getUsername(), loginUser.getPassword());

        if (isAuthenticated) {
            // Find the full user record from DB
            register_model user = registerService.findByUsername(loginUser.getUsername());

            // Prepare user details to send back to frontend
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("id", user.getId());
            userDetails.put("username", user.getUsername());
            userDetails.put("email", user.getEmail());

            response.put("message", "Login successful");
            response.put("user", userDetails);  // ✅ Now includes ID
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

    @GetMapping("/{id}")
    public register_model getUserById(@PathVariable Long id) {
        return registerService.findById(id);
    }

    @GetMapping("/get-address/{id}")
    public Map<String, String> getDeliveryAddress(@PathVariable Long id) {
        register_model user = registerService.findById(id);
        Map<String, String> response = new HashMap<>();
        if (user != null && user.getDeliveryAddress() != null) {
            response.put("deliveryAddress", user.getDeliveryAddress());
        } else {
            response.put("deliveryAddress", "");
        }
        return response;
    }

    @PutMapping("/update-address/{id}")
    public String updateAddress(@PathVariable Long id, @RequestParam String address) {
        registerService.updateDeliveryAddress(id, address);
        return "Delivery address updated successfully.";
    }
}
