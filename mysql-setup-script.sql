-- =====================================================
-- E-Commerce Database Setup Script
-- Database: ecommerce_db
-- Created: November 23, 2025
-- =====================================================

-- Drop existing database if it exists
DROP DATABASE IF EXISTS ecommerce_db;

-- Create the database
CREATE DATABASE ecommerce_db;

-- Use the database
USE ecommerce_db;

-- =====================================================
-- Table 1: Accounts (Users)
-- =====================================================
CREATE TABLE accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table 2: Products
-- =====================================================
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL,
    rating DOUBLE NOT NULL DEFAULT 0,
    category VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    image_url VARCHAR(1000),
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_price (price),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table 3: Cart
-- =====================================================
CREATE TABLE cart (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_product (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table 4: Orders
-- =====================================================
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    total_price DOUBLE NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_address VARCHAR(500),
    card_last_four VARCHAR(16),
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_order_date (order_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table 5: Order Items (Order Details)
-- =====================================================
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DOUBLE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert 12 Sample Products
INSERT INTO products (name, price, rating, category, description, image_url, stock) VALUES
('Wireless Headphones', 79.99, 4.5, 'Electronics', 'High-quality wireless headphones with noise cancellation and 30-hour battery life', 'https://via.placeholder.com/300?text=Headphones', 50),
('USB-C Cable', 14.99, 4.8, 'Accessories', 'Durable USB-C charging and data cable with 5-year warranty', 'https://via.placeholder.com/300?text=USB-C+Cable', 200),
('Smartphone Stand', 19.99, 4.7, 'Accessories', 'Adjustable smartphone stand for desk and table with stable grip', 'https://via.placeholder.com/300?text=Phone+Stand', 100),
('Wireless Mouse', 34.99, 4.6, 'Electronics', 'Ergonomic wireless mouse with precision tracking and long battery life', 'https://via.placeholder.com/300?text=Wireless+Mouse', 75),
('Mechanical Keyboard', 89.99, 4.9, 'Electronics', 'RGB mechanical keyboard with custom switches and programmable keys', 'https://via.placeholder.com/300?text=Keyboard', 40),
('Screen Protector', 9.99, 4.4, 'Accessories', 'Tempered glass screen protector for smartphones with easy installation', 'https://via.placeholder.com/300?text=Screen+Protector', 300),
('Phone Case', 24.99, 4.6, 'Accessories', 'Premium protective phone case with design patterns and shock absorption', 'https://via.placeholder.com/300?text=Phone+Case', 150),
('Portable Charger', 49.99, 4.7, 'Electronics', '20000mAh portable charger with fast charging for multiple devices', 'https://via.placeholder.com/300?text=Portable+Charger', 60),
('Laptop Stand', 39.99, 4.5, 'Accessories', 'Adjustable aluminum laptop stand for better ergonomics and cooling', 'https://via.placeholder.com/300?text=Laptop+Stand', 80),
('HDMI Cable', 12.99, 4.8, 'Accessories', 'High-speed HDMI 2.1 cable for 4K video and audio transmission', 'https://via.placeholder.com/300?text=HDMI+Cable', 250),
('USB Hub', 29.99, 4.5, 'Electronics', '7-port USB 3.0 hub with fast charging and individual switches', 'https://via.placeholder.com/300?text=USB+Hub', 90),
('Desk Lamp', 44.99, 4.6, 'Accessories', 'LED desk lamp with adjustable brightness and color temperature control', 'https://via.placeholder.com/300?text=Desk+Lamp', 55);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify database created
SELECT DATABASE() AS current_database;

-- Show all tables
SHOW TABLES;

-- Count records in each table
SELECT 'accounts' as table_name, COUNT(*) as record_count FROM accounts
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'cart', COUNT(*) FROM cart
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM order_items;

-- Display all products
SELECT * FROM products;

-- =====================================================
-- USEFUL QUERIES FOR TESTING
-- =====================================================

-- Get all products with details
-- SELECT * FROM products;

-- Search products by name
-- SELECT * FROM products WHERE LOWER(name) LIKE LOWER('%mouse%');

-- Filter products by price and rating
-- SELECT * FROM products WHERE price BETWEEN 20 AND 50 AND rating >= 4.5;

-- Sort products by price (low to high)
-- SELECT * FROM products ORDER BY price ASC;

-- Sort products by rating (high to low)
-- SELECT * FROM products ORDER BY rating DESC;

-- Get user's cart
-- SELECT c.id, c.user_id, c.product_id, p.name, p.price, c.quantity, (p.price * c.quantity) as total
-- FROM cart c
-- JOIN products p ON c.product_id = p.id
-- WHERE c.user_id = 1;

-- Get user's order history
-- SELECT o.id, o.user_id, o.total_price, o.order_date, o.delivery_address
-- FROM orders o
-- WHERE o.user_id = 1
-- ORDER BY o.order_date DESC;

-- =====================================================
-- END OF SCRIPT
-- =====================================================

