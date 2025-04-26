package org.example.cs308project.order.checkout;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.cs308project.order.pdf_invoice.invoice_service;

@RestController
@RequestMapping("/checkout")
public class checkout_controller {

    @Autowired
    private checkout_service checkoutService;

    @Autowired
    private invoice_service invoiceService;

    @PostMapping
    public ResponseEntity<String> checkout(@RequestParam Long userId,
                                           @RequestParam String deliveryAddress,
                                           @RequestParam String email) {
        try {
            Long lastOrderId = checkoutService.processCheckout(userId, deliveryAddress);

            // Send invoice
            invoiceService.sendInvoiceToEmail(lastOrderId, email);

            return ResponseEntity.ok("Checkout completed and invoice sent.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Checkout failed: " + e.getMessage());
        }
    }
}
