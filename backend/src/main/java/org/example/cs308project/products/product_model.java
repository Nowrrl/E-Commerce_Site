package org.example.cs308project.products;

import jakarta.persistence.*;

@Entity
@Table(name = "products_table")
public class product_model {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false, unique = true)
    private String serialNumber;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private String warrantyStatus;

    @Column(nullable = false)
    private String distributorInfo;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getWarrantyStatus() { return warrantyStatus; }
    public void setWarrantyStatus(String warrantyStatus) { this.warrantyStatus = warrantyStatus; }

    public String getDistributorInfo() { return distributorInfo; }
    public void setDistributorInfo(String distributorInfo) { this.distributorInfo = distributorInfo; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}

