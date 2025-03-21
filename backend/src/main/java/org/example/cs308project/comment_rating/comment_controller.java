package org.example.cs308project.comment_rating;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
