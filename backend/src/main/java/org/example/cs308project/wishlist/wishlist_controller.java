package org.example.cs308project.wishlist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
public class wishlist_controller {

    @Autowired
    private wishlist_service wishlistService;

    @PostMapping("/add")
    public String addToWishlist(@RequestParam Long userId, @RequestParam Long productId) {
        return wishlistService.addToWishlist(userId, productId);
    }

    @GetMapping("/user/{userId}")
    public List<wishlist_model> getWishlist(@PathVariable Long userId) {
        return wishlistService.getUserWishlist(userId);
    }

    @DeleteMapping("/remove")
    public String removeFromWishlist(@RequestParam Long userId, @RequestParam Long productId) {
        return wishlistService.removeFromWishlist(userId, productId);
    }
}
