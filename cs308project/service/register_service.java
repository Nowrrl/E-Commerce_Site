package org.example.cs308project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.example.cs308project.repository.register_repository;
import org.example.cs308project.repository.login_repository;
import org.example.cs308project.model.register_model;
import org.example.cs308project.model.login_model;

@Service
public class register_service {

    @Autowired
    private register_repository registerRepository;

    @Autowired
    private login_repository loginRepository;

    public register_model registerUser(String email, String username, String password) {
        // Create a new register_model instance
        register_model newUser = new register_model();
        newUser.setEmail(email);
        newUser.setUsername(username);
        newUser.setPassword(password);

        // Save user in register_table
        registerRepository.save(newUser);

        // Now create a login_model instance for login_table
        login_model loginUser = new login_model();
        loginUser.setUsername(username);
        loginUser.setPassword(password);

        // Save user credentials in login_table
        loginRepository.save(loginUser);

        return newUser;
    }

    public boolean userExists(String username) {
        return registerRepository.findByUsername(username) != null;
    }
}
