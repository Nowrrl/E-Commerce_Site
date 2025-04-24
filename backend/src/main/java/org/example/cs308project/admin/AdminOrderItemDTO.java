package org.example.cs308project.admin;

public class AdminOrderItemDTO {
    private String productName;
    private int quantity;
    private double unitPrice;

    public AdminOrderItemDTO(String productName, int quantity, double unitPrice) {
        this.productName = productName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public String getProductName() { return productName; }
    public int getQuantity() { return quantity; }
    public double getUnitPrice() { return unitPrice; }
}
