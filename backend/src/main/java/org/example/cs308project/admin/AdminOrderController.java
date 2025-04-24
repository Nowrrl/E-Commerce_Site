package org.example.cs308project.admin;

import org.example.cs308project.order.order_history.order_model;
import org.example.cs308project.order.order_history.order_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/orders")
public class AdminOrderController {

    @Autowired
    private order_repository orderRepository;

    @GetMapping
    public List<AdminOrderDTO> getAllOrders() {
        List<order_model> orders = orderRepository.findAll();
        return orders.stream().map(order -> {
            AdminOrderDTO dto = new AdminOrderDTO();
            dto.setId(order.getOrderId());
            dto.setCustomer(order.getUser().getUsername());
            dto.setProduct(order.getProduct().getName());
            dto.setQty(order.getQuantity());
            dto.setTotal(order.getTotalPrice());
            dto.setAddress(order.getDeliveryAddress());
            dto.setStatus(order.getStatus());
            return dto;
        }).collect(Collectors.toList());
    }

    @PostMapping("/{orderId}/status")
    public String updateStatus(@PathVariable Long orderId, @RequestParam String status) {
        order_model order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return "Order not found";
        }
        order.setStatus(status);
        orderRepository.save(order);
        return "Status updated to " + status;
    }
}
