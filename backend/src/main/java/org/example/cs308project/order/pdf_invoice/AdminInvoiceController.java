package org.example.cs308project.order.pdf_invoice;

import org.example.cs308project.order.order_history.order_model;
import org.example.cs308project.order.order_history.order_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/invoices")
@PreAuthorize("hasRole('SALES_MANAGER')")
public class AdminInvoiceController {

    @Autowired
    private order_repository orderRepo;

    @Autowired
    private invoice_service invoiceService;

    /**
     * DTO to send back the invoice metadata (orderId, customer, total, date)
     */
    public static class InvoiceDTO {
        public Long orderId;
        public String customerName;
        public double totalPrice;
        public LocalDateTime createdAt;
    }

    /**
     * List all invoices (orders) between two dates.
     */
    @GetMapping
    public List<InvoiceDTO> listInvoices(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end   = to.plusDays(1).atStartOfDay();

        List<order_model> orders = orderRepo.findByCreatedAtBetween(start, end);

        return orders.stream().map(o -> {
            InvoiceDTO dto = new InvoiceDTO();
            dto.orderId     = o.getOrderId();
            dto.customerName= o.getUser().getUsername();
            dto.totalPrice  = o.getTotalPrice();
            dto.createdAt   = o.getCreatedAt();
            return dto;
        }).collect(Collectors.toList());
    }

    /**
     * Download one invoice PDF for the given orderId.
     */
    @GetMapping("/{orderId}/download")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long orderId) {
        try {
            byte[] pdfData = invoiceService.generateInvoice(orderId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(
                    ContentDisposition.inline()
                            .filename("invoice_order_" + orderId + ".pdf")
                            .build()
            );

            return new ResponseEntity<>(pdfData, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
