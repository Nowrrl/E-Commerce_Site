package org.example.cs308project.comment_rating;

import jakarta.persistence.*;
import org.example.cs308project.loginregister.model.register_model;
import org.example.cs308project.products.product_model;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class comment_model {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private register_model user;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private product_model product;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String text;

    @Column(nullable = false)
    private int rating;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // NEW: approved flag, defaults to false
    @Column(nullable = false)
    private boolean approved = false;

    public comment_model() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters & setters

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public register_model getUser() {
        return user;
    }
    public void setUser(register_model user) {
        this.user = user;
    }

    public product_model getProduct() {
        return product;
    }
    public void setProduct(product_model product) {
        this.product = product;
    }

    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }

    public int getRating() {
        return rating;
    }
    public void setRating(int rating) {
        this.rating = rating;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // NEW getter & setter for approved
    public boolean isApproved() {
        return approved;
    }
    public void setApproved(boolean approved) {
        this.approved = approved;
    }
}
