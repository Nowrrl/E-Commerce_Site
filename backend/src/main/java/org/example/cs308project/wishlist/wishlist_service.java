package org.example.cs308project.wishlist;

import org.example.cs308project.loginregister.model.register_model;
import org.example.cs308project.loginregister.repository.register_repository;
import org.example.cs308project.products.product_model;
import org.example.cs308project.products.product_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class wishlist_service {

    @Autowired
    private wishlist_repository wishlistRepository;

    @Autowired
    private register_repository registerRepository;

    @Autowired
    private product_repository productRepository;

    public String addToWishlist(Long userId, Long productId) {
        Optional<register_model> user = registerRepository.findById(userId);
        Optional<product_model> product = productRepository.findById(productId);

        if (user.isPresent() && product.isPresent()) {
            wishlist_model wish = new wishlist_model();
            wish.setUser(user.get());
            wish.setProduct(product.get());
            wishlistRepository.save(wish);
            return "Product added to wishlist.";
        }
        return "User or product not found.";
    }

    public List<wishlist_model> getUserWishlist(Long userId) {
        return registerRepository.findById(userId)
                .map(wishlistRepository::findByUser)
                .orElse(null);
    }

    public String removeFromWishlist(Long userId, Long productId) {
        Optional<register_model> user = registerRepository.findById(userId);
        Optional<product_model> product = productRepository.findById(productId);

        if (user.isPresent() && product.isPresent()) {
            wishlistRepository.deleteByUserAndProduct(user.get(), product.get());
            return "Product removed from wishlist.";
        }
        return "User or product not found.";
    }
}
