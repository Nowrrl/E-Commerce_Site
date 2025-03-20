package org.example.cs308project.shoppingcart;

import org.example.cs308project.products.product_service;
import org.example.cs308project.loginregister.service.register_service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
public class cart_controller {

    @Autowired
    private cart_service cartService;

    @Autowired
    private register_service registerService;

    @Autowired
    private product_service productService;

    // Add product to cart
    @PostMapping("/add")
    public String addToCart(@RequestBody Map<String, Object> request) {
        String emailOrUsername = request.get("emailOrUsername").toString();
        String productIdentifier = request.get("productIdentifier").toString();
        int quantity = Integer.parseInt(request.get("quantity").toString());

        Long userId = emailOrUsername.contains("@") ?
                registerService.getUserIdByEmail(emailOrUsername) :
                registerService.getUserIdByUsername(emailOrUsername);

        if (userId == null) {
            return "User not found";
        }

        Long productId = productIdentifier.startsWith("SN") ?
                productService.getProductIdBySerialNumber(productIdentifier) :
                productService.getProductIdByName(productIdentifier);

        if (productId == null) {
            return "Product not found";
        }

        return cartService.addToCart(userId, productId, quantity);
    }

    // Remove product from cart
    @DeleteMapping("/remove")
    public String removeFromCart(@RequestParam Long userId, @RequestParam Long productId) {
        return cartService.removeFromCart(userId, productId);
    }

    // View cart
    @GetMapping("/view")
    public List<cart_model> viewCart(@RequestParam Long userId) {
        return cartService.viewCart(userId);
    }
}
