package org.example.cs308project.admin;

public class AdminOrderDTO {
    private Long id;
    private String customer;
    private String product;
    private int qty;
    private double total;
    private String address;
    private String status;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomer() { return customer; }
    public void setCustomer(String customer) { this.customer = customer; }

    public String getProduct() { return product; }
    public void setProduct(String product) { this.product = product; }

    public int getQty() { return qty; }
    public void setQty(int qty) { this.qty = qty; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
