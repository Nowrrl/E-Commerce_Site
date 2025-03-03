package org.example.cs308project.products.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.example.cs308project.products.repository.product_repository;
import org.example.cs308project.products.model.product_model;

import java.util.List;
import java.util.Optional;

@Service
public class product_service {

    @Autowired
    private product_repository productRepository;

    // Add a new product
    public product_model addProduct(product_model product) {
        return productRepository.save(product);
    }

    // Update an existing product
    public product_model updateProduct(Long id, product_model updatedProduct) {
        Optional<product_model> existingProduct = productRepository.findById(id);

        if (existingProduct.isPresent()) {
            product_model product = existingProduct.get();
            product.setName(updatedProduct.getName());
            product.setModel(updatedProduct.getModel());
            product.setSerialNumber(updatedProduct.getSerialNumber());
            product.setDescription(updatedProduct.getDescription());
            product.setQuantity(updatedProduct.getQuantity());
            product.setPrice(updatedProduct.getPrice());
            product.setWarrantyStatus(updatedProduct.getWarrantyStatus());
            product.setDistributorInfo(updatedProduct.getDistributorInfo());

            return productRepository.save(product);
        } else {
            return null; // Handle not found case
        }
    }

    // Delete a product
    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Get all products
    public List<product_model> getAllProducts() {
        return productRepository.findAll();
    }

    // Get a product by ID
    public Optional<product_model> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<product_model> searchByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    // Search by Model
    public List<product_model> searchByModel(String model) {
        return productRepository.findByModelContainingIgnoreCase(model);
    }

    // Search by Serial Number
    public Optional<product_model> searchBySerialNumber(String serialNumber) {
        return Optional.ofNullable(productRepository.findBySerialNumber(serialNumber));
    }

    // Search by Description (Keyword)
    public List<product_model> searchByDescription(String keyword) {
        return productRepository.findByDescriptionContainingIgnoreCase(keyword);
    }

    // Filter by Price Range
    public List<product_model> filterByPrice(double minPrice, double maxPrice) {
        return productRepository.filterByPriceRange(minPrice, maxPrice);
    }

    // Filter by Minimum Quantity
    public List<product_model> filterByMinQuantity(int minQuantity) {
        return productRepository.filterByMinQuantity(minQuantity);
    }

    // Filter by Warranty Status
    public List<product_model> filterByWarrantyStatus(String warrantyStatus) {
        return productRepository.findByWarrantyStatusIgnoreCase(warrantyStatus);
    }
}

