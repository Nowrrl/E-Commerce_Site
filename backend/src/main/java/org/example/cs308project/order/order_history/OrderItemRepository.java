package org.example.cs308project.order.order_history;

import org.example.cs308project.order.order_history.order_model;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrder(order_model order);
}
