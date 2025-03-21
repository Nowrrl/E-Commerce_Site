package org.example.cs308project.comment_rating;

import org.example.cs308project.products.product_model;
import org.example.cs308project.loginregister.model.register_model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface comment_repository extends JpaRepository<comment_model, Long> {
    List<comment_model> findByProductId(Long productId); // Fetch comments by productId
    List<comment_model> findByUserId(Long userId); // Fetch comments by userId
}
