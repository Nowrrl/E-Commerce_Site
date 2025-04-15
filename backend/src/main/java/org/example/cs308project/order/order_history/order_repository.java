package org.example.cs308project.order.order_history;

import org.example.cs308project.loginregister.model.register_model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface order_repository extends JpaRepository<order_model, Long> {
    List<order_model> findByUser(register_model user);
}
