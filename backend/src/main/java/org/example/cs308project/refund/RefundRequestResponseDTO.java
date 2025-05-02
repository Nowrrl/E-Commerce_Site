package org.example.cs308project.refund;

import java.time.LocalDateTime;

public class RefundRequestResponseDTO {
    private Long refundId;
    private Long orderId;
    private String productName;
    private String customerName;
    private double priceAtPurchase;
    private LocalDateTime requestDate;
    private String status;

    // Constructor
    public RefundRequestResponseDTO(Long refundId, Long orderId, String productName, String customerName,
                                    double priceAtPurchase, LocalDateTime requestDate, String status) {
        this.refundId = refundId;
        this.orderId = orderId;
        this.productName = productName;
        this.customerName = customerName;
        this.priceAtPurchase = priceAtPurchase;
        this.requestDate = requestDate;
        this.status = status;
    }

    // --- Getters and Setters ---

    public Long getRefundId() { return refundId; }
    public void setRefundId(Long refundId) { this.refundId = refundId; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public double getPriceAtPurchase() { return priceAtPurchase; }
    public void setPriceAtPurchase(double priceAtPurchase) { this.priceAtPurchase = priceAtPurchase; }

    public LocalDateTime getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDateTime requestDate) { this.requestDate = requestDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
