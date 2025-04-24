package org.example.cs308project.products;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface product_repository extends JpaRepository<product_model, Long> {

    // Search by Name (Case-Insensitive)
    List<product_model> findByNameContainingIgnoreCase(String name);

    List<product_model> findByCategoryId(Long categoryId);

    // Search by Model
    List<product_model> findByModelContainingIgnoreCase(String model);

    // Search by Serial Number (Exact Match)
    product_model findBySerialNumber(String serialNumber);

    // Search by Name
    product_model findByName(String name);

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


    List<product_model> findAllByOrderByPriceAsc();
    List<product_model> findAllByOrderByPriceDesc();

    // Sort by ID (Newest First)
    List<product_model> findAllByOrderByIdDesc();

    // Sort by quantity (ascending or descending)
    List<product_model> findAllByOrderByQuantityAsc();
    List<product_model> findAllByOrderByQuantityDesc();

    // Generic sorting method
    List<product_model> findAll(Sort sort);
    Page<product_model> findAll(Pageable pageable);


    @Query("SELECT DISTINCT p.category FROM product_model p WHERE p.category IS NOT NULL")
    List<String> findDistinctCategories();


}

