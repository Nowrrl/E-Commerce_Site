package org.example.cs308project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.example.cs308project.model.workers_model;

@Repository
public interface workers_repository extends JpaRepository<workers_model, Long> {
    workers_model findByUsername(String username);
}

