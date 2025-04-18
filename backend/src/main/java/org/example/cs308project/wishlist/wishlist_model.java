package org.example.cs308project.wishlist;

import jakarta.persistence.*;
import org.example.cs308project.loginregister.model.register_model;
import org.example.cs308project.products.product_model;

@Entity
@Table(name = "wishlist_table")
public class wishlist_model {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private register_model user;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private product_model product;

    // Getters and setters
    public Long getId() { return id; }

    public register_model getUser() { return user; }

    public void setUser(register_model user) { this.user = user; }

    public product_model getProduct() { return product; }

    public void setProduct(product_model product) { this.product = product; }
}
