package org.example.cs308project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.example.cs308project.repository.workers_repository;
import org.example.cs308project.model.workers_model;

@Service
public class workers_service {

    @Autowired
    private workers_repository workersRepository;

    public workers_model findByUsername(String username) {
        return workersRepository.findByUsername(username);
    }
}
