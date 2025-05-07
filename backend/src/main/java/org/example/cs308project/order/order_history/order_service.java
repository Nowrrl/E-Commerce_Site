package org.example.cs308project.order.order_history;

import org.example.cs308project.loginregister.model.register_model;
import org.example.cs308project.loginregister.repository.register_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.example.cs308project.products.product_model;
import org.example.cs308project.products.product_repository;
import java.time.LocalDateTime;
import java.util.Map;

import java.util.List;
import java.util.Optional;

@Service
public class order_service {

    @Autowired
    private order_repository orderRepository;

    @Autowired
    private register_repository registerRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private product_repository productRepository;

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

    // 🛠 Updated createOrder()
    public order_model createOrder(order_model newOrder) {
        order_model savedOrder = orderRepository.save(newOrder);

        // Update product's soldCount and quantity
        product_model product = savedOrder.getProduct();
        int quantityPurchased = savedOrder.getQuantity();

        product.setSoldCount(product.getSoldCount() + quantityPurchased);
        product.setQuantity(product.getQuantity() - quantityPurchased); // ✅ decrease stock
        productRepository.save(product);

        return savedOrder;
    }

    public List<order_model> getAllOrders() {
        return orderRepository.findAll();
    }


     // Returns total revenue, cost (50% of sales), and profit between two dates.
    public Map<String, Double> calculateReport(LocalDateTime from, LocalDateTime to) {
        Double revenue = orderRepository.sumRevenueBetween(from, to);
        Double cost    = orderRepository.sumCostBetween(from, to);
        double profit  = revenue - cost;
        return Map.of(
                "revenue", revenue,
                "cost",    cost,
                "profit",  profit
        );
    }

    // 🛠 Updated placeOrder()
    public order_model placeOrder(order_model order, List<OrderItem> items) {
        order_model savedOrder = orderRepository.save(order);

        for (OrderItem item : items) {
            item.setOrder(savedOrder);
            orderItemRepository.save(item);

            product_model product = item.getProduct();
            int quantityPurchased = item.getQuantity();

            product.setSoldCount(product.getSoldCount() + quantityPurchased);
            product.setQuantity(product.getQuantity() - quantityPurchased); // ✅ decrease stock
            productRepository.save(product);
        }

        return savedOrder;
    }
}
