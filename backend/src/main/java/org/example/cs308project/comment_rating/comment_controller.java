// src/main/java/org/example/cs308project/comment_rating/comment_controller.java
package org.example.cs308project.comment_rating;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
public class comment_controller {

    @Autowired
    private comment_service commentService;

    @PostMapping(
            path = "/add",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public comment_model addComment(@RequestBody CommentRequest req) {
        return commentService.addComment(
                req.getUserId(),
                req.getProductId(),
                req.getText(),
                req.getRating()
        );
    }

    @GetMapping("/product/{productId}")
    public List<comment_model> getApprovedCommentsByProduct(@PathVariable Long productId) {
        return commentService.getApprovedCommentsByProduct(productId);
    }

    @GetMapping("/user/{userId}")
    public List<comment_model> getCommentsByUser(@PathVariable Long userId) {
        return commentService.getCommentsByUser(userId);
    }

    @GetMapping("/average-rating/{productId}")
    public double getAverageRating(@PathVariable Long productId) {
        return commentService.getAverageRatingByProductId(productId);
    }

    @PostMapping("/add-rating")
    public String addRating(@RequestBody CommentRequest req) {
        return commentService.addRating(
                req.getUserId(),
                req.getProductId(),
                req.getRating()
        );
    }

    @GetMapping("/ratings/user/{userId}")
    public List<Integer> getRatingsByUser(@PathVariable Long userId) {
        return commentService.getRatingsByUserId(userId);
    }

    @GetMapping("/ratings/product/{productId}")
    public List<Integer> getRatingsByProduct(@PathVariable Long productId) {
        return commentService.getRatingsByProductId(productId);
    }

    @PutMapping("/{commentId}")
    public comment_model editCommentSimple(@PathVariable Long commentId, @RequestBody CommentEditRequest body) {
        return commentService.editComment(commentId, body.getText());
    }

    @DeleteMapping("/{commentId}")
    public void deleteCommentSimple(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
    }

    @GetMapping("/pending")
    public List<comment_model> getPendingComments() {
        return commentService.getPendingComments();
    }

    @PutMapping("/approve/{commentId}")
    public comment_model approveComment(@PathVariable Long commentId) {
        return commentService.approveComment(commentId);
    }

    @DeleteMapping("/reject/{commentId}")
    public void rejectComment(@PathVariable Long commentId) {
        commentService.rejectComment(commentId);
    }

    @GetMapping("/approved")
    public List<comment_model> getAllApprovedComments() {
        return commentService.getAllApprovedComments();
    }

}
