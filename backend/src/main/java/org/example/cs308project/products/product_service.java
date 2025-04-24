package org.example.cs308project.products;

import org.example.cs308project.categories.category_model;
import org.example.cs308project.categories.category_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class product_service {

    @Autowired
    private product_repository productRepository;

    @Autowired
    private category_repository categoryRepository;



    // Add a new product
    public product_model addProduct(product_model product) {
        // Capitalize and normalize category name
        String rawName = product.getCategory().getName().trim();
        String capitalizedName = rawName.substring(0, 1).toUpperCase() + rawName.substring(1).toLowerCase();

        category_model category = categoryRepository.findByName(capitalizedName).orElseGet(() -> {
            category_model newCat = new category_model();
            newCat.setName(capitalizedName);
            return categoryRepository.save(newCat);
        });

        product.setCategory(category);
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
            product.setImageUrl(updatedProduct.getImageUrl());


            // Capitalize and normalize category name during update
            String rawName = updatedProduct.getCategory().getName().trim();
            String capitalizedName = rawName.substring(0, 1).toUpperCase() + rawName.substring(1).toLowerCase();

            category_model category = categoryRepository.findByName(capitalizedName).orElseGet(() -> {
                category_model newCat = new category_model();
                newCat.setName(capitalizedName);
                return categoryRepository.save(newCat);
            });

            product.setCategory(category);
            return productRepository.save(product);
        } else {
            return null;
        }
    }

    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<product_model> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<product_model> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<product_model> searchByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    public List<product_model> searchByModel(String model) {
        return productRepository.findByModelContainingIgnoreCase(model);
    }

    public Optional<product_model> searchBySerialNumber(String serialNumber) {
        return Optional.ofNullable(productRepository.findBySerialNumber(serialNumber));
    }

    public List<product_model> searchByDescription(String keyword) {
        return productRepository.findByDescriptionContainingIgnoreCase(keyword);
    }

    public List<product_model> filterByPrice(double minPrice, double maxPrice) {
        return productRepository.filterByPriceRange(minPrice, maxPrice);
    }

    public List<product_model> filterByMinQuantity(int minQuantity) {
        return productRepository.filterByMinQuantity(minQuantity);
    }

    public List<product_model> filterByWarrantyStatus(String warrantyStatus) {
        return productRepository.findByWarrantyStatusIgnoreCase(warrantyStatus);
    }

    public List<product_model> sortByPriceAsc() {
        return productRepository.findAllByOrderByPriceAsc();
    }

    public List<product_model> sortByPriceDesc() {
        return productRepository.findAllByOrderByPriceDesc();
    }

    public List<product_model> sortByNewest() {
        return productRepository.findAllByOrderByIdDesc();
    }

    public List<product_model> sortByQuantityAsc() {
        return productRepository.findAllByOrderByQuantityAsc();
    }

    public List<product_model> sortByQuantityDesc() {
        return productRepository.findAllByOrderByQuantityDesc();
    }

    public List<product_model> sortProducts(String field, String direction) {
        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(field).ascending()
                : Sort.by(field).descending();
        return productRepository.findAll(sort);
    }

    public Page<product_model> getPaginatedProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAll(pageable);
    }

    public Long getProductIdBySerialNumber(String serialNumber) {
        product_model product = productRepository.findBySerialNumber(serialNumber);
        return (product != null) ? product.getId() : null;
    }

    public Long getProductIdByName(String name) {
        product_model product = productRepository.findByName(name);
        return (product != null) ? product.getId() : null;
    }

    public String getCategoryByName(String name) {
        product_model product = productRepository.findByName(name);
        return (product != null) ? product.getCategory().getName() : null;
    }

    public String getCategoryByProductId(Long id) {
        Optional<product_model> product = productRepository.findById(id);
        return product.map(p -> p.getCategory().getName()).orElse("Category not found");
    }

    public product_model save(product_model product) {
        return productRepository.save(product);
    }
}
