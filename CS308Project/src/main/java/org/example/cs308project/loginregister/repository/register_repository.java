package org.example.cs308project.loginregister.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.example.cs308project.loginregister.model.register_model;

@Repository
public interface register_repository extends JpaRepository<register_model, Long> {
    register_model findByEmail(String email);
    register_model findByUsername(String username);
}
