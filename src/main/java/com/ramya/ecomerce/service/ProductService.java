package com.ramya.ecomerce.service;

import com.ramya.ecomerce.entity.Product;
import com.ramya.ecomerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public List<Product> searchProducts(String search) {
        if (search == null || search.isEmpty()) {
            return getAllProducts();
        }
        return productRepository.searchProducts(search);
    }

    public List<Product> filterProducts(Double minPrice, Double maxPrice, Double minRating, Double maxRating) {
        return productRepository.filterProducts(minPrice, maxPrice, minRating, maxRating);
    }

    public List<Product> sortProducts(List<Product> products, String sortBy, String order) {
        Comparator<Product> comparator = null;

        if ("price".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparingDouble(Product::getPrice);
        } else if ("rating".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparingDouble(Product::getRating);
        } else if ("name".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(Product::getName);
        }

        if (comparator != null) {
            if ("desc".equalsIgnoreCase(order)) {
                comparator = comparator.reversed();
            }
            return products.stream().sorted(comparator).collect(Collectors.toList());
        }

        return products;
    }
}

