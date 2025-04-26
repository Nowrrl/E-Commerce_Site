package org.example.cs308project.order.checkout;

import org.example.cs308project.shoppingcart.cart_model;
import org.example.cs308project.shoppingcart.cart_repository;
import org.example.cs308project.loginregister.model.register_model;
import org.example.cs308project.loginregister.repository.register_repository;
import org.example.cs308project.order.order_history.order_model;
import org.example.cs308project.order.order_history.order_repository;
import org.example.cs308project.products.product_model;
import org.example.cs308project.products.product_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class checkout_service {

    @Autowired
    private cart_repository cartRepository;

    @Autowired
    private register_repository registerRepository;

    @Autowired
    private product_repository productRepository;

    @Autowired
    private order_repository orderRepository;

    public Long processCheckout(Long userId, String deliveryAddress) {
        Optional<register_model> userOpt = registerRepository.findById(userId);
        if (userOpt.isEmpty()) throw new RuntimeException("User not found");

        register_model user = userOpt.get();
        List<cart_model> userCart = cartRepository.findByUserId(userId);
        if (userCart.isEmpty()) throw new RuntimeException("Cart is empty");

        Long lastOrderId = null;

        for (cart_model cartItem : userCart) {
            Optional<product_model> productOpt = productRepository.findById(cartItem.getProductId());
            if (productOpt.isEmpty()) continue;

            product_model product = productOpt.get();
            if (product.getQuantity() < cartItem.getQuantity()) continue;

            product.setQuantity(product.getQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            order_model order = new order_model();
            order.setUser(user);
            order.setProduct(product);
            order.setQuantity(cartItem.getQuantity());
            order.setTotalPrice(product.getPrice() * cartItem.getQuantity());
            order.setDeliveryAddress(deliveryAddress);

            order_model savedOrder = orderRepository.save(order);
            lastOrderId = savedOrder.getOrderId();  // Save last one to email invoice
        }

        cartRepository.deleteAll(userCart);

        if (lastOrderId == null) throw new RuntimeException("No orders were created");
        return lastOrderId;
    }
}
