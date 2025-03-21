package org.example.cs308project.loginregister.repository;

import org.example.cs308project.loginregister.model.login_model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface login_repository extends JpaRepository<login_model, Long> {
    login_model findByUsername(String username);
}
