package org.example.cs308project.order.order_history;

import org.example.cs308project.loginregister.model.register_model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;

@Repository
public interface order_repository extends JpaRepository<order_model, Long> {
    List<order_model> findByUser(register_model user);

    int countByUser(register_model user);

    @Query("SELECT SUM(o.totalPrice) FROM order_model o WHERE o.user = :user")
    Double sumTotalPriceByUser(@Param("user") register_model user);

}
