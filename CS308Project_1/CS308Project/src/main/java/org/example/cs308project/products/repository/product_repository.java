package org.example.cs308project.products.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.example.cs308project.products.model.product_model;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface product_repository extends JpaRepository<product_model, Long> {

    // Search by Name (Case-Insensitive)
    List<product_model> findByNameContainingIgnoreCase(String name);

    // Search by Model
    List<product_model> findByModelContainingIgnoreCase(String model);

    // Search by Serial Number (Exact Match)
    product_model findBySerialNumber(String serialNumber);

    // Search by Description (Keyword-based)
    List<product_model> findByDescriptionContainingIgnoreCase(String keyword);

    // Filter by Price Range
    @Query("SELECT p FROM product_model p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    List<product_model> filterByPriceRange(@Param("minPrice") double minPrice, @Param("maxPrice") double maxPrice);

    // Filter by Quantity
    @Query("SELECT p FROM product_model p WHERE p.quantity >= :minQuantity")
    List<product_model> filterByMinQuantity(@Param("minQuantity") int minQuantity);

    // Filter by Warranty Status
    List<product_model> findByWarrantyStatusIgnoreCase(String warrantyStatus);
}

