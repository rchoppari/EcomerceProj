package com.ramya.ecomerce.util;

import com.ramya.ecomerce.entity.Product;
import com.ramya.ecomerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (productRepository.count() > 0) {
            return;
        }

        // Initialize sample products
        Product[] products = {
            new Product(null, "Wireless Headphones", 79.99, 4.5, "Electronics", "High-quality wireless headphones with noise cancellation", "https://via.placeholder.com/300?text=Headphones", 50),
            new Product(null, "USB-C Cable", 14.99, 4.8, "Accessories", "Durable USB-C charging and data cable", "https://via.placeholder.com/300?text=USB-C+Cable", 200),
            new Product(null, "Smartphone Stand", 19.99, 4.7, "Accessories", "Adjustable smartphone stand for desk", "https://via.placeholder.com/300?text=Phone+Stand", 100),
            new Product(null, "Wireless Mouse", 34.99, 4.6, "Electronics", "Ergonomic wireless mouse with precision tracking", "https://via.placeholder.com/300?text=Wireless+Mouse", 75),
            new Product(null, "Mechanical Keyboard", 89.99, 4.9, "Electronics", "RGB mechanical keyboard with switches", "https://via.placeholder.com/300?text=Keyboard", 40),
            new Product(null, "Screen Protector", 9.99, 4.4, "Accessories", "Tempered glass screen protector for smartphones", "https://via.placeholder.com/300?text=Screen+Protector", 300),
            new Product(null, "Phone Case", 24.99, 4.6, "Accessories", "Premium protective phone case with design patterns", "https://via.placeholder.com/300?text=Phone+Case", 150),
            new Product(null, "Portable Charger", 49.99, 4.7, "Electronics", "20000mAh portable charger with fast charging", "https://via.placeholder.com/300?text=Portable+Charger", 60),
            new Product(null, "Laptop Stand", 39.99, 4.5, "Accessories", "Adjustable aluminum laptop stand for better ergonomics", "https://via.placeholder.com/300?text=Laptop+Stand", 80),
            new Product(null, "HDMI Cable", 12.99, 4.8, "Accessories", "High-speed HDMI 2.1 cable for 4K video", "https://via.placeholder.com/300?text=HDMI+Cable", 250),
            new Product(null, "USB Hub", 29.99, 4.5, "Electronics", "7-port USB 3.0 hub with fast charging", "https://via.placeholder.com/300?text=USB+Hub", 90),
            new Product(null, "Desk Lamp", 44.99, 4.6, "Accessories", "LED desk lamp with adjustable brightness and color", "https://via.placeholder.com/300?text=Desk+Lamp", 55)
        };

        for (Product product : products) {
            productRepository.save(product);
        }

        System.out.println("Sample products initialized successfully!");
    }
}

