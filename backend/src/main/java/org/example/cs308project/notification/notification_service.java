package org.example.cs308project.notification;

import org.example.cs308project.loginregister.model.register_model;
import org.example.cs308project.loginregister.repository.register_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class notification_service {

    @Autowired
    private notification_repository notificationRepository;

    @Autowired
    private register_repository registerRepository;

    public void addNotification(Long userId, String message) {
        register_model user = registerRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        notification_model notification = notification_model.builder()
                .user(user)
                .message(message)
                .read(false)
                .timestamp(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }

    public List<notification_model> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public void markAsRead(Long notificationId) {
        notification_model notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification != null) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }
}
