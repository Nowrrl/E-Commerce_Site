package org.example.cs308project.comment_rating;

import org.example.cs308project.loginregister.model.register_model;
import org.example.cs308project.loginregister.repository.register_repository;
import org.example.cs308project.products.product_model;
import org.example.cs308project.products.product_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class comment_service {

    @Autowired
    private comment_repository commentRepository;

    @Autowired
    private register_repository userRepository;

    @Autowired
    private product_repository productRepository;

    // Add a new comment
    public comment_model addComment(Long userId, Long productId, String text, int rating) {
        Optional<register_model> user = userRepository.findById(userId);
        Optional<product_model> product = productRepository.findById(productId);

        if (user.isPresent() && product.isPresent()) {
            comment_model comment = new comment_model();
            comment.setUser(user.get());
            comment.setProduct(product.get());
            comment.setText(text);
            comment.setRating(rating);
            return commentRepository.save(comment);
        }
        return null;
    }

    // Get all comments for a product
    public List<comment_model> getCommentsByProduct(Long productId) {
        return commentRepository.findByProductId(productId);
    }

    // Get all comments by a user
    public List<comment_model> getCommentsByUser(Long userId) {
        return commentRepository.findByUserId(userId);
    }
}
