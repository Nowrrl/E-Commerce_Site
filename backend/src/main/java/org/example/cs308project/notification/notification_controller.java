package org.example.cs308project.notification;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class notification_controller {

    @Autowired
    private notification_repository notificationRepository;

    @GetMapping("/{userId}")
    public List<NotificationDTO> getUserNotifications(@PathVariable Long userId) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId)
                .stream()
                .map(n -> {
                    NotificationDTO dto = new NotificationDTO();
                    dto.setId(n.getId());
                    dto.setMessage(n.getMessage());
                    dto.setRead(n.isRead());
                    dto.setTimestamp(n.getTimestamp());
                    return dto;
                }).toList();
    }
}
