package org.example.cs308project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.example.cs308project.repository.login_repository;
import org.example.cs308project.model.login_model;

@Service
public class login_service {

    @Autowired
    private login_repository loginRepository;

    // Find a user by username
    public login_model findByUsername(String username) {
        return loginRepository.findByUsername(username);
    }

    // Authenticate login credentials
    public boolean authenticate(String username, String password) {
        login_model user = loginRepository.findByUsername(username);
        return user != null && user.getPassword().equals(password);
    }
}
