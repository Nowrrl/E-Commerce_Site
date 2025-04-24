package org.example.cs308project.products;

import org.example.cs308project.categories.category_model;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
public class product_controller {

    @Autowired
    private product_service productService;

    @Autowired
    private product_repository productRepository;

    // Add a new product
    @PostMapping("/add")
    public product_model addProduct(@RequestBody product_model product) {
        return productService.addProduct(product);
    }

    // Update a product by ID
    @PutMapping("/update/{id}")
    public product_model updateProduct(@PathVariable Long id, @RequestBody product_model product) {
        return productService.updateProduct(id, product);
    }

    // Delete a product by ID
    @DeleteMapping("/delete/{id}")
    public String deleteProduct(@PathVariable Long id) {
        boolean isDeleted = productService.deleteProduct(id);
        return isDeleted ? "Product deleted successfully" : "Product not found";
    }

    // Get all products
    @GetMapping("/all")
    public List<product_model> getAllProducts() {
        return productService.getAllProducts();
    }

    // Get product by ID
    @GetMapping("/{id}")
    public Optional<product_model> getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    // Search endpoints
    @GetMapping("/search/name")
    public List<product_model> searchByName(@RequestParam String name) {
        return productService.searchByName(name);
    }

    @GetMapping("/search/model")
    public List<product_model> searchByModel(@RequestParam String model) {
        return productService.searchByModel(model);
    }

    @GetMapping("/search/serial")
    public Optional<product_model> searchBySerialNumber(@RequestParam String serialNumber) {
        return productService.searchBySerialNumber(serialNumber);
    }

    @GetMapping("/search/description")
    public List<product_model> searchByDescription(@RequestParam String keyword) {
        return productService.searchByDescription(keyword);
    }

    // Filter endpoints
    @GetMapping("/filter/price")
    public List<product_model> filterByPrice(@RequestParam double minPrice, @RequestParam double maxPrice) {
        return productService.filterByPrice(minPrice, maxPrice);
    }

    @GetMapping("/filter/quantity")
    public List<product_model> filterByMinQuantity(@RequestParam int minQuantity) {
        return productService.filterByMinQuantity(minQuantity);
    }

    @GetMapping("/filter/warranty")
    public List<product_model> filterByWarrantyStatus(@RequestParam String warrantyStatus) {
        return productService.filterByWarrantyStatus(warrantyStatus);
    }

    // Sort endpoints
    @GetMapping("/sort/price/asc")
    public List<product_model> sortByPriceAsc() {
        return productService.sortByPriceAsc();
    }

    @GetMapping("/sort/price/desc")
    public List<product_model> sortByPriceDesc() {
        return productService.sortByPriceDesc();
    }

    @GetMapping("/sort/newest")
    public List<product_model> sortByNewest() {
        return productService.sortByNewest();
    }

    @GetMapping("/sort/quantity/asc")
    public List<product_model> sortByQuantityAsc() {
        return productService.sortByQuantityAsc();
    }

    @GetMapping("/sort/quantity/desc")
    public List<product_model> sortByQuantityDesc() {
        return productService.sortByQuantityDesc();
    }

    @GetMapping("/sort")
    public List<product_model> sortProducts(@RequestParam String field, @RequestParam String direction) {
        return productService.sortProducts(field, direction);
    }

    // Pagination
    @GetMapping("/page")
    public Page<product_model> getPaginatedProducts(@RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "5") int size) {
        return productService.getPaginatedProducts(page, size);
    }

    // Get category of a product
    @GetMapping("/category/{id}")
    public String getCategoryByProductId(@PathVariable Long id) {
        return productService.getCategoryByProductId(id);
    }

    // Get full category object (optional)
    @GetMapping("/category-object/{id}")
    public category_model getCategoryObject(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(product_model::getCategory)
                .orElse(null);
    }

    // Get products by category (optional but useful)
    @GetMapping("/by-category/{categoryId}")
    public List<product_model> getByCategory(@PathVariable Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }
}
