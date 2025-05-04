package org.example.cs308project.notification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface notification_repository extends JpaRepository<notification_model, Long> {
    List<notification_model> findByUserIdOrderByTimestampDesc(Long userId);
}
