package org.example.cs308project.shoppingcart;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface cart_repository extends JpaRepository<cart_model, Long> {
    List<cart_model> findByUserId(Long userId);
    cart_model findByUserIdAndProductId(Long userId, Long productId);
}
