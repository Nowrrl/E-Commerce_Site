package org.example.cs308project.admin;

import org.example.cs308project.loginregister.model.workers_model;
import org.example.cs308project.loginregister.repository.workers_repository;
import org.example.cs308project.products.product_model;
import org.example.cs308project.products.product_service;
import org.example.cs308project.products.ProductDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin/products")
@PreAuthorize("hasAnyRole('PRODUCT_MANAGER','SALES_MANAGER')")
public class AdminProductController {

    @Autowired
    private product_service productService;

    @Autowired
    private workers_repository workersRepository;

    @GetMapping("/{id}")
    public Optional<product_model> getById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @PostMapping
    public product_model create(@RequestBody product_model p) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        workers_model worker = workersRepository.findByUsername(username);

        if (worker != null && "PRODUCT_MANAGER".equals(worker.getRole())) {
            p.setPrice(0.0); // Default price
            p.setApprovedBySales(false); // Awaiting approval
        }

        return productService.addProduct(p);
    }

    @PutMapping("/{id}")
    public product_model update(@PathVariable Long id, @RequestBody product_model p) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        workers_model worker = workersRepository.findByUsername(username);

        product_model existingProduct = productService.getProductById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (worker != null && "PRODUCT_MANAGER".equals(worker.getRole())) {
            // ✅ Keep approved price and approval status
            p.setPrice(existingProduct.getPrice());
            p.setApprovedBySales(existingProduct.isApprovedBySales());
            p.setCategory(existingProduct.getCategory()); // Keep existing category
        }

        return productService.updateProduct(id, p);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        boolean ok = productService.deleteProduct(id);
        if (!ok) throw new RuntimeException("Product not found");
    }

    @PutMapping("/{id}/price")
    @PreAuthorize("hasRole('SALES_MANAGER')")
    public ResponseEntity<?> setProductPrice(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {

        double price = Double.parseDouble(payload.get("price").toString());

        product_model product = productService.getProductById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setPrice(price);
        product.setApprovedBySales(true);

        productService.save(product);

        return ResponseEntity.ok("Price set and product approved");
    }

    @GetMapping
    public List<ProductDTO> listAll() {
        return productService.getAllProducts().stream().map(product -> {
            ProductDTO dto = new ProductDTO();
            dto.setId(product.getId());
            dto.setName(product.getName());
            dto.setModel(product.getModel());
            dto.setQuantity(product.getQuantity());
            dto.setPrice(product.getPrice());
            dto.setApprovedBySales(product.isApprovedBySales());

            dto.setSerialNumber(product.getSerialNumber());
            dto.setImageUrl(product.getImageUrl());
            dto.setDescription(product.getDescription());
            dto.setWarrantyStatus(product.getWarrantyStatus());
            dto.setDistributorInfo(product.getDistributorInfo());

            if (product.getCategory() != null) {
                dto.setCategoryName(product.getCategory().getName());
            } else {
                dto.setCategoryName("");
            }

            return dto;
        }).toList();
    }
}
