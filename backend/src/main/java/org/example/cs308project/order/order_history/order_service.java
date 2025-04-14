package org.example.cs308project.order.order_history;

import org.example.cs308project.loginregister.model.register_model;
import org.example.cs308project.loginregister.repository.register_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class order_service {

    @Autowired
    private order_repository orderRepository;

    @Autowired
    private register_repository registerRepository;

    public List<order_model> getOrdersByUserId(Long userId) {
        Optional<register_model> user = registerRepository.findById(userId);
        return user.map(orderRepository::findByUser).orElse(null);
    }

    public Optional<order_model> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    public order_model updateOrderStatus(Long orderId, String newStatus) {
        Optional<order_model> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isPresent()) {
            order_model order = optionalOrder.get();
            order.setStatus(newStatus);
            return orderRepository.save(order);
        }
        return null;
    }

    public List<order_model> getAllOrders() {
        return orderRepository.findAll();
    }
}
