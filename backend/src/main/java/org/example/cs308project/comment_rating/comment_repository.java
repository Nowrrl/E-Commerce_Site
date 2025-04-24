// src/main/java/org/example/cs308project/comment_rating/comment_repository.java
package org.example.cs308project.comment_rating;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface comment_repository extends JpaRepository<comment_model, Long> {
    List<comment_model> findByProductId(Long productId);
    List<comment_model> findByUserId(Long userId);

    // NEW: find only comments pending approval
    List<comment_model> findByApprovedFalse();
    List<comment_model> findByApprovedTrue();

}
