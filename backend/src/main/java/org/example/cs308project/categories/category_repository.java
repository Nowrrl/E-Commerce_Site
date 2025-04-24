package org.example.cs308project.categories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface category_repository extends JpaRepository<category_model, Long> {
    boolean existsByName(String name);
    Optional<category_model> findByName(String name);
}
