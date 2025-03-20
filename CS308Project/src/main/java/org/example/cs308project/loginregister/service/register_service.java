package org.example.cs308project.loginregister.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.example.cs308project.loginregister.repository.register_repository;
import org.example.cs308project.loginregister.repository.login_repository;
import org.example.cs308project.loginregister.model.register_model;
import org.example.cs308project.loginregister.model.login_model;

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

    public Long getUserIdByEmail(String email) {
        register_model user = registerRepository.findByEmail(email);
        return (user != null) ? user.getId() : null;
    }

    public Long getUserIdByUsername(String username) {
        register_model user = registerRepository.findByUsername(username);
        return (user != null) ? user.getId() : null;
    }
}
