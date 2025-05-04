package org.example.cs308project.wishlist;

import org.example.cs308project.loginregister.model.register_model;
import org.example.cs308project.products.product_model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;

public interface wishlist_repository extends JpaRepository<wishlist_model, Long> {
    List<wishlist_model> findByUser(register_model user);

    @Transactional
    void deleteByUserAndProduct(register_model user, product_model product);

    @Query("SELECT w.user.id FROM wishlist_model w WHERE w.product.id = :productId")
    List<Long> findUserIdsByProductId(@Param("productId") Long productId);

    // ✅ Add this
    List<wishlist_model> findByProduct(product_model product);
}
