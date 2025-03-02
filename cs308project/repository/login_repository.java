package org.example.cs308project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.example.cs308project.model.login_model;

@Repository
public interface login_repository extends JpaRepository<login_model, Long> {
    login_model findByUsername(String username);
}
