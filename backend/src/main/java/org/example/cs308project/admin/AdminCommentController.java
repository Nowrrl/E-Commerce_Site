// src/main/java/org/example/cs308project/comment_rating/AdminCommentController.java
package org.example.cs308project.admin;

import org.example.cs308project.comment_rating.comment_model;
import org.example.cs308project.comment_rating.comment_service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/comments")
public class AdminCommentController {

    @Autowired private comment_service commentService;

    /** GET /admin/comments/pending */
    @GetMapping("/pending")
    public List<comment_model> listPending() {
        return commentService.getPendingComments();
    }

    /** POST /admin/comments/{id}/approve */
    @PostMapping("/{id}/approve")
    public comment_model approve(@PathVariable Long id) {
        return commentService.approveComment(id);
    }

    /** POST /admin/comments/{id}/reject */
    @PostMapping("/{id}/reject")
    public void reject(@PathVariable Long id) {
        commentService.rejectComment(id);
    }
}
