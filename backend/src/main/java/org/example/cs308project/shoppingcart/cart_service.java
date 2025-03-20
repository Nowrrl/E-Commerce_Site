package org.example.cs308project.shoppingcart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.example.cs308project.products.product_repository;
import org.example.cs308project.products.product_model;

import java.util.List;
import java.util.Optional;

@Service
public class cart_service {

    @Autowired
    private cart_repository cartRepository;

    @Autowired
    private product_repository productRepository;

    // Add a product to the cart
    public String addToCart(Long userId, Long productId, int quantity) {
        Optional<product_model> productOptional = productRepository.findById(productId);

        if (productOptional.isEmpty()) {
            return "Product not found";
        }

        product_model product = productOptional.get();

        // Check if the product is in stock
        if (product.getQuantity() < quantity) {
            return "Not enough stock available";
        }

        // Check if the product is already in the cart
        cart_model existingCartItem = cartRepository.findByUserIdAndProductId(userId, productId);
        if (existingCartItem != null) {
            existingCartItem.setQuantity(existingCartItem.getQuantity() + quantity);
            cartRepository.save(existingCartItem);
        } else {
            cart_model newCartItem = new cart_model();
            newCartItem.setUserId(userId);
            newCartItem.setProductId(productId);
            newCartItem.setQuantity(quantity);
            cartRepository.save(newCartItem);
        }

        return "Product added to cart";
    }

    // Remove a product from the cart
    public String removeFromCart(Long userId, Long productId) {
        cart_model cartItem = cartRepository.findByUserIdAndProductId(userId, productId);
        if (cartItem == null) {
            return "Product not found in cart";
        }

        cartRepository.delete(cartItem);
        return "Product removed from cart";
    }

    // View cart for a user
    public List<cart_model> viewCart(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    // Empty cart after checkout
    public void clearCart(Long userId) {
        List<cart_model> cartItems = cartRepository.findByUserId(userId);
        cartRepository.deleteAll(cartItems);
    }
}
