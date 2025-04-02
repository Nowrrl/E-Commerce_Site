package org.example.cs308project.order.order_history;

import jakarta.persistence.*;
import org.example.cs308project.loginregister.model.register_model;
import org.example.cs308project.products.product_model;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class order_model {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private register_model user;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private product_model product;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private double totalPrice;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String deliveryAddress;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public order_model() {
        this.createdAt = LocalDateTime.now();
        this.status = "processing";
    }

    // Getters and Setters

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
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

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
