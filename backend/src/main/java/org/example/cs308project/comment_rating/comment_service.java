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

    public double getAverageRatingByProductId(Long productId) {
        List<comment_model> comments = commentRepository.findByProductId(productId);
        if (comments.isEmpty()) return 0.0;

        double sum = 0;
        for (comment_model comment : comments) {
            sum += comment.getRating();
        }
        return sum / comments.size();
    }

    public String addRating(Long userId, Long productId, int rating) {
        Optional<register_model> user = userRepository.findById(userId);
        Optional<product_model> product = productRepository.findById(productId);

        if (user.isPresent() && product.isPresent()) {
            comment_model comment = new comment_model();
            comment.setUser(user.get());
            comment.setProduct(product.get());
            comment.setText(""); // Empty comment
            comment.setRating(rating);
            commentRepository.save(comment);
            return "Rating added.";
        }
        return "User or product not found.";
    }

    public List<Integer> getRatingsByUserId(Long userId) {
        List<comment_model> comments = commentRepository.findByUserId(userId);
        return comments.stream()
                .map(comment_model::getRating)
                .filter(rating -> rating > 0)
                .toList();
    }

    public List<Integer> getRatingsByProductId(Long productId) {
        List<comment_model> comments = commentRepository.findByProductId(productId);
        return comments.stream()
                .map(comment_model::getRating)
                .filter(rating -> rating > 0)
                .toList();
    }



    // Get all comments by a user
    public List<comment_model> getCommentsByUser(Long userId) {
        return commentRepository.findByUserId(userId);
    }
}
