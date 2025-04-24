package org.example.cs308project.order.order_history;

import jakarta.persistence.*;
import org.example.cs308project.order.order_history.order_model;
import org.example.cs308project.products.product_model;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;
    private double unitPrice;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private order_model order;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private product_model product;

    // Getters and setters
    public Long getId() { return id; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }

    public order_model getOrder() { return order; }
    public void setOrder(order_model order) { this.order = order; }

    public product_model getProduct() { return product; }
    public void setProduct(product_model product) { this.product = product; }
}
