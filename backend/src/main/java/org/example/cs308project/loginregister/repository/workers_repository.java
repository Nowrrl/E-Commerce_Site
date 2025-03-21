package org.example.cs308project.loginregister.repository;

import org.example.cs308project.loginregister.model.workers_model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface workers_repository extends JpaRepository<workers_model, Long> {
    workers_model findByUsername(String username);
}

