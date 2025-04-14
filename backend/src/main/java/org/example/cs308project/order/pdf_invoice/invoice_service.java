package org.example.cs308project.order.pdf_invoice;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import org.example.cs308project.order.order_history.order_model;
import org.example.cs308project.order.order_history.order_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class invoice_service {

    @Autowired
    private order_repository orderRepository;

    public byte[] generateInvoice(Long orderId) throws Exception {
        order_model order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("INVOICE")
                .setBold()
                .setFontSize(20)
                .setTextAlignment(TextAlignment.CENTER));

        document.add(new Paragraph("Order ID: " + order.getOrderId()));
        document.add(new Paragraph("Customer ID: " + order.getUser().getId()));
        document.add(new Paragraph("Product ID: " + order.getProduct().getId()));
        document.add(new Paragraph("Product Name: " + order.getProduct().getName()));
        document.add(new Paragraph("Quantity: " + order.getQuantity()));
        document.add(new Paragraph("Total Price: $" + order.getTotalPrice()));
        document.add(new Paragraph("Delivery Address: " + order.getDeliveryAddress()));
        document.add(new Paragraph("Status: " + order.getStatus()));
        document.add(new Paragraph("Date: " +
                order.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))));

        document.close();
        return out.toByteArray();
    }
}
