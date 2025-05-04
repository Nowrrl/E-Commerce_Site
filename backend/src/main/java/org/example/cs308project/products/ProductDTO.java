package org.example.cs308project.products;

public class ProductDTO {
    private Long id;
    private String name;
    private String model;
    private int quantity;
    private double price;
    private Double originalPrice; // 👈 Add this

    private boolean approvedBySales;
    private String categoryName;

    private String serialNumber;
    private String imageUrl;
    private String description;
    private String warrantyStatus;
    private String distributorInfo;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public Double getOriginalPrice() { return originalPrice; }  // ✅ Getter
    public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; } // ✅ Setter

    public boolean isApprovedBySales() { return approvedBySales; }
    public void setApprovedBySales(boolean approvedBySales) { this.approvedBySales = approvedBySales; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getWarrantyStatus() { return warrantyStatus; }
    public void setWarrantyStatus(String warrantyStatus) { this.warrantyStatus = warrantyStatus; }

    public String getDistributorInfo() { return distributorInfo; }
    public void setDistributorInfo(String distributorInfo) { this.distributorInfo = distributorInfo; }
}
