package org.example.cs308project.products.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.example.cs308project.products.service.product_service;
import org.example.cs308project.products.model.product_model;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
public class product_controller {

    @Autowired
    private product_service productService;

    // Add a new product
    @PostMapping("/add")
    public product_model addProduct(@RequestBody product_model product) {
        return productService.addProduct(product);
    }

    // Update a product by ID
    @PutMapping("/update/{id}")
    public product_model updateProduct(@PathVariable Long id, @RequestBody product_model product) {
        return productService.updateProduct(id, product);
    }

    // Delete a product by ID
    @DeleteMapping("/delete/{id}")
    public String deleteProduct(@PathVariable Long id) {
        boolean isDeleted = productService.deleteProduct(id);
        return isDeleted ? "Product deleted successfully" : "Product not found";
    }

    // Get all products
    @GetMapping("/all")
    public List<product_model> getAllProducts() {
        return productService.getAllProducts();
    }

    // Get product by ID
    @GetMapping("/{id}")
    public Optional<product_model> getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/search/name")
    public List<product_model> searchByName(@RequestParam String name) {
        return productService.searchByName(name);
    }

    // Search by Model
    @GetMapping("/search/model")
    public List<product_model> searchByModel(@RequestParam String model) {
        return productService.searchByModel(model);
    }

    // Search by Serial Number
    @GetMapping("/search/serial")
    public Optional<product_model> searchBySerialNumber(@RequestParam String serialNumber) {
        return productService.searchBySerialNumber(serialNumber);
    }

    // Search by Description
    @GetMapping("/search/description")
    public List<product_model> searchByDescription(@RequestParam String keyword) {
        return productService.searchByDescription(keyword);
    }

    // Filter by Price Range
    @GetMapping("/filter/price")
    public List<product_model> filterByPrice(@RequestParam double minPrice, @RequestParam double maxPrice) {
        return productService.filterByPrice(minPrice, maxPrice);
    }

    // Filter by Minimum Quantity
    @GetMapping("/filter/quantity")
    public List<product_model> filterByMinQuantity(@RequestParam int minQuantity) {
        return productService.filterByMinQuantity(minQuantity);
    }

    // Filter by Warranty Status
    @GetMapping("/filter/warranty")
    public List<product_model> filterByWarrantyStatus(@RequestParam String warrantyStatus) {
        return productService.filterByWarrantyStatus(warrantyStatus);
    }
}

