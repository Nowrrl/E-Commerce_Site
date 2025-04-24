// src/main/java/org/example/cs308project/comment_rating/CommentRequest.java
package org.example.cs308project.comment_rating;

public class CommentRequest {
    private Long userId;
    private Long productId;
    private String text;
    private int rating;

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public Long getProductId() {
        return productId;
    }
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    public int getRating() {
        return rating;
    }
    public void setRating(int rating) {
        this.rating = rating;
    }
}
