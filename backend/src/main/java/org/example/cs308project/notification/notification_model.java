package org.example.cs308project.notification;

import jakarta.persistence.*;
import lombok.*;
import org.example.cs308project.loginregister.model.register_model;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications") // 👈 optional but good practice
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class notification_model {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // 👈 improves performance in lists
    @JoinColumn(name = "user_id", nullable = false)
    private register_model user;

    private String message;

    @Column(name = "`read`", nullable = false) // 👈 `read` is a keyword in some DBs
    private boolean read = false;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now(); // 💡 ensures timestamp is set
    }
}
