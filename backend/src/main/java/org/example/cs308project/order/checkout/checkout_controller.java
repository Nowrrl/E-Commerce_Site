package org.example.cs308project.order.checkout;

import org.example.cs308project.order.order_history.order_model;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/checkout")
public class checkout_controller {

    @Autowired
    private checkout_service checkoutService;

    @PostMapping
    public List<order_model> checkout(@RequestParam Long userId,
                                      @RequestParam String deliveryAddress) {
        return checkoutService.processCheckout(userId, deliveryAddress);
    }
}
