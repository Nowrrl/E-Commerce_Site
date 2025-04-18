package org.example.cs308project.wishlist;

import org.example.cs308project.loginregister.model.register_model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface wishlist_repository extends JpaRepository<wishlist_model, Long> {
    List<wishlist_model> findByUser(register_model user);
    @Transactional
    void deleteByUserAndProduct(register_model user, org.example.cs308project.products.product_model product);
}
