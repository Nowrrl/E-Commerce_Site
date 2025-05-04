package org.example.cs308project.refund;

import org.example.cs308project.order.order_history.order_model;
import org.example.cs308project.order.order_history.order_repository;
import org.example.cs308project.products.product_model;
import org.example.cs308project.products.product_repository;
import org.example.cs308project.loginregister.model.register_model;
import org.example.cs308project.loginregister.repository.register_repository;
import org.example.cs308project.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.example.cs308project.notification.notification_repository;
import org.example.cs308project.notification.notification_model;




import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class RefundController {

    @Autowired
    private RefundRepository refundRepository;

    @Autowired
    private order_repository orderRepository;

    @Autowired
    private product_repository productRepository;

    @Autowired
    private register_repository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private notification_repository notificationRepository;

    // Customer requests a refund
    @PostMapping("/refunds/request")
    public String requestRefund(@RequestBody RefundRequestDto requestDto) {
        order_model order = orderRepository.findById(requestDto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"delivered".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Order is not delivered yet!");
        }

        RefundRequest refund = new RefundRequest(
                order.getOrderId(),
                order.getUser().getId(),
                order.getProduct().getId(),
                order.getTotalPrice()
        );

        refundRepository.save(refund);

        return "Refund request submitted successfully!";
    }

    // Admin view all refunds
    @GetMapping("/admin/refunds")
    public List<RefundRequestResponseDTO> getAllRefunds() {
        List<RefundRequest> refunds = refundRepository.findAll();

        return refunds.stream().map(refund -> {
            product_model product = productRepository.findById(refund.getProductId())
                    .orElse(null);
            register_model user = userRepository.findById(refund.getUserId())
                    .orElse(null);

            String productName = (product != null) ? product.getName() : "Unknown Product";
            String customerName = (user != null) ? user.getUsername() : "Unknown Customer";

            return new RefundRequestResponseDTO(
                    refund.getRefundId(),
                    refund.getOrderId(),
                    productName,
                    customerName,
                    refund.getPriceAtPurchase(),
                    refund.getRequestDate(),
                    refund.getStatus()
            );
        }).toList();
    }

    // Admin approve refund
    @PutMapping("/admin/refunds/{refundId}/approve")
    public ResponseEntity<order_model> approveRefund(@PathVariable Long refundId) {
        RefundRequest refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new RuntimeException("Refund request not found"));

        if (!"Pending".equalsIgnoreCase(refund.getStatus())) {
            throw new RuntimeException("Refund has already been processed.");
        }

        refund.setStatus("Approved");

        product_model product = productRepository.findById(refund.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        register_model user = userRepository.findById(refund.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Update stock
        product.setQuantity(product.getQuantity() + 1);
        productRepository.save(product);

        // ✅ Update order status to "refunded"
        order_model order = orderRepository.findById(refund.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus("refunded");
        orderRepository.save(order);

        refundRepository.save(refund);

        // ✅ Send Notification
        notification_model notification = notification_model.builder()
                .user(user)
                .message("✅ Your refund request for \"" + product.getName() + "\" has been approved.")
                .timestamp(java.time.LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        // ✅ Email (optional)
        String subject = "Your Refund Has Been Approved - Smart Electronics";
        String text = "Dear " + user.getUsername() + ",\n\n" +
                "Your refund request for \"" + product.getName() + "\" has been APPROVED.\n" +
                "We've updated your order status accordingly.\n\n" +
                "Best,\nSmart Electronics";
        emailService.sendSimpleMessage(user.getEmail(), subject, text);

        return ResponseEntity.ok(order);
    }

    // Admin reject refund
    @PutMapping("/admin/refunds/{refundId}/reject")
    public String rejectRefund(@PathVariable Long refundId) {
        RefundRequest refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new RuntimeException("Refund request not found"));

        if (!"Pending".equalsIgnoreCase(refund.getStatus())) {
            throw new RuntimeException("Refund has already been processed.");
        }

        refund.setStatus("Rejected");

        register_model user = userRepository.findById(refund.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        refundRepository.save(refund);

        // ✉️ Send Rejection Email
        String subject = "Your Refund Has Been Rejected - Smart Electronics";
        String text = "Dear " + user.getUsername() + ",\n\n" +
                "Unfortunately, your refund request for Order ID #" + refund.getOrderId() + " has been REJECTED.\n" +
                "If you have any questions, please contact our support team.\n\n" +
                "Best regards,\nSmart Electronics Team";

        emailService.sendSimpleMessage(user.getEmail(), subject, text);


        product_model product = productRepository.findById(refund.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        refundRepository.save(refund);

        // 🔔 Send Notification
        notification_model notification = notification_model.builder()
                .user(user)
                .message("❌ Your refund request for \"" + product.getName() + "\" has been approved.")
                .read(false)
                .timestamp(java.time.LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        return "Refund rejected and email sent!";
    }

    // DTO for Request Body
    public static class RefundRequestDto {
        private Long orderId;

        public Long getOrderId() {
            return orderId;
        }

        public void setOrderId(Long orderId) {
            this.orderId = orderId;
        }
    }
}
