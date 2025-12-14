package com.ramya.ecomerce.controller;

import com.ramya.ecomerce.entity.Product;
import com.ramya.ecomerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Double maxRating,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String order) {

        List<Product> products;

        // Apply search first
        if (search != null && !search.isEmpty()) {
            products = productService.searchProducts(search);
        }
        // Apply filters
        else if (minPrice != null && maxPrice != null && minRating != null && maxRating != null) {
            products = productService.filterProducts(minPrice, maxPrice, minRating, maxRating);
        }
        // Get all products
        else {
            products = productService.getAllProducts();
        }

        // Apply sorting
        products = productService.sortProducts(products, sortBy, order);

        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        }
        return ResponseEntity.notFound().build();
    }
}

