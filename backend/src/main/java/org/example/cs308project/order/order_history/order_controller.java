package org.example.cs308project.order.order_history;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/orders")
public class order_controller {

    @Autowired
    private order_service orderService;

    @GetMapping("/user/{userId}")
    public List<order_model> getUserOrders(@PathVariable Long userId) {
        return orderService.getOrdersByUserId(userId);
    }

    @GetMapping("/{orderId}")
    public Optional<order_model> getOrderById(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId);
    }

    @PutMapping("/update-status/{orderId}")
    public order_model updateOrderStatus(@PathVariable Long orderId,
                                         @RequestParam String status) {
        return orderService.updateOrderStatus(orderId, status);
    }

    @GetMapping("/all")
    public List<order_model> getAllOrders() {
        return orderService.getAllOrders();
    }
}