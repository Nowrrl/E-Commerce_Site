package org.example.cs308project.comment_rating;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/comments")
public class comment_controller {

    @Autowired
    private comment_service commentService;

    // Add a new comment
    @PostMapping("/add")
    public comment_model addComment(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam String text,
            @RequestParam int rating) {
        return commentService.addComment(userId, productId, text, rating);
    }

    // Get all comments for a specific product
    @GetMapping("/product/{productId}")
    public List<comment_model> getCommentsByProduct(@PathVariable Long productId) {
        return commentService.getCommentsByProduct(productId);
    }

    // Get all comments made by a specific user
    @GetMapping("/user/{userId}")
    public List<comment_model> getCommentsByUser(@PathVariable Long userId) {
        return commentService.getCommentsByUser(userId);
    }

    @GetMapping("/average-rating/{productId}")
    public double getAverageRating(@PathVariable Long productId) {
        return commentService.getAverageRatingByProductId(productId);
    }

    @PostMapping("/add-rating")
    public String addRating(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        Long productId = Long.valueOf(request.get("productId").toString());
        int rating = Integer.parseInt(request.get("rating").toString());

        return commentService.addRating(userId, productId, rating);
    }

    @GetMapping("/ratings/user/{userId}")
    public List<Integer> getRatingsByUser(@PathVariable Long userId) {
        return commentService.getRatingsByUserId(userId);
    }

    @GetMapping("/ratings/product/{productId}")
    public List<Integer> getRatingsByProduct(@PathVariable Long productId) {
        return commentService.getRatingsByProductId(productId);
    }


}
