package org.example.cs308project.refund;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "refund_requests")
public class RefundRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long refundId;

    private Long orderId;

    private Long userId;

    private Long productId;

    private double priceAtPurchase;

    private LocalDateTime requestDate;

    private String status; // Pending, Approved, Rejected

    public RefundRequest() {
        // Default constructor
    }

    public RefundRequest(Long orderId, Long userId, Long productId, double priceAtPurchase) {
        this.orderId = orderId;
        this.userId = userId;
        this.productId = productId;
        this.priceAtPurchase = priceAtPurchase;
        this.requestDate = LocalDateTime.now();
        this.status = "Pending";
    }

    // --- Getters and Setters ---

    public Long getRefundId() {
        return refundId;
    }

    public void setRefundId(Long refundId) {
        this.refundId = refundId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public double getPriceAtPurchase() {
        return priceAtPurchase;
    }

    public void setPriceAtPurchase(double priceAtPurchase) {
        this.priceAtPurchase = priceAtPurchase;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
