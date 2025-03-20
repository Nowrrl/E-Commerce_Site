package org.example.cs308project.shoppingcart;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_table")
public class cart_model {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId; // User who owns the cart

    @Column(nullable = false)
    private Long productId; // Product added to cart

    @Column(nullable = false)
    private int quantity; // Quantity of the product

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
