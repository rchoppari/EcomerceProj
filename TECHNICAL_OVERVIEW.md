# E-Commerce Application - Technical Overview Guide for Beginners

## Table of Contents
1. [Project Introduction](#project-introduction)
2. [System Architecture](#system-architecture)
3. [Database Design](#database-design)
4. [Backend Flow](#backend-flow)
5. [Frontend Flow](#frontend-flow)
6. [Frontend Components](#frontend-components)
7. [API Endpoints](#api-endpoints)
8. [Technology Stack](#technology-stack)
9. [Getting Started](#getting-started)

---

## Project Introduction

This is a **Full-Stack E-Commerce Application** built with:
- **Backend**: Spring Boot (Java)
- **Frontend**: React with Redux
- **Database**: MySQL
- **Communication**: REST API with CORS

The application allows users to:
✅ Register and login  
✅ Browse and search products  
✅ Add products to cart  
✅ Place orders  
✅ View order history  

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE (Port 5173)                      │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              React Application (Frontend)                     │  │
│  │                                                               │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐    │  │
│  │  │  Components │  │  Redux      │  │  Service Layer   │    │  │
│  │  │  (UI)       │  │  (State)    │  │  (API Calls)     │    │  │
│  │  └─────────────┘  └─────────────┘  └──────────────────┘    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                    HTTP/REST API │ (CORS Enabled)
                                 │
┌─────────────────────────────────────────────────────────────────────┐
│                    SERVER SIDE (Port 8080)                          │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │          Spring Boot Application (Backend)                   │  │
│  │                                                               │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐    │  │
│  │  │ Controllers  │→ │   Services   │→ │  Repositories  │    │  │
│  │  │ (REST API)   │  │ (Business    │  │  (Data Access) │    │  │
│  │  │              │  │  Logic)      │  │                │    │  │
│  │  └──────────────┘  └──────────────┘  └────────────────┘    │  │
│  │         ↓                                      ↓              │  │
│  │  ┌──────────────┐                  ┌──────────────────┐     │  │
│  │  │  JWT Security│                  │ JPA Hibernate    │     │  │
│  │  │  & CORS      │                  │ (ORM)            │     │  │
│  │  └──────────────┘                  └──────────────────┘     │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                       JDBC Driver│
                                 │
┌─────────────────────────────────────────────────────────────────────┐
│                    DATABASE (MySQL)                                  │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ ┌──────────┐│
│  │  accounts    │  │  products    │  │  cart        │ │  orders  ││
│  │  (Users)     │  │  (Inventory) │  │  (Shopping)  │ │ (History)││
│  └──────────────┘  └──────────────┘  └──────────────┘ └──────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

---

## Database Design

### Entity Relationship Diagram (ERD)

```
┌─────────────────────┐
│     ACCOUNTS        │
├─────────────────────┤
│ PK: id (Long)       │
│ firstName (String)  │
│ lastName (String)   │
│ email (String)      │◄────┐
│ password (String)   │     │ One-to-Many (User to Orders)
└─────────────────────┘     │
         │                  │
         │ 1                │ Many
         │                  │
         ├──────────────────┤
         │                  │
    (many carts)       (many orders)
         │                  │
         │ Many             │ Many
         │                  │
┌─────────────────────┐     ┌──────────────────┐
│      CART           │     │     ORDERS       │
├─────────────────────┤     ├──────────────────┤
│ PK: id (Long)       │     │ PK: id (Long)    │
│ FK: user_id (Long)  │     │ FK: user_id      │
│ FK: product_id      │     │ totalPrice       │
│ quantity (Integer)  │     │ orderDate        │
└─────────────────────┘     │ deliveryAddress  │
         │                  │ cardLastFour     │
         │                  └──────────────────┘
    (references)            │
         │                  │
         │ Many             │
         │                  ├─────────────────────┐
         │                  │                     │
    ┌────────────────────┐  │ One-to-Many
    │    PRODUCTS        │  │ (Order to OrderItems)
    ├────────────────────┤  │
    │ PK: id (Long)      │  │
    │ name (String)      │  │ Many
    │ price (Double)     │  │
    │ rating (Double)    │  ├──────────────────────┐
    │ category (String)  │  │                      │
    │ description        │  │              ┌─────────────────┐
    │ imageUrl           │  │              │  ORDER_ITEMS    │
    │ stock (Integer)    │  │              ├─────────────────┤
    └────────────────────┘  │              │ PK: id (Long)   │
                            │              │ FK: order_id    │
                            │              │ FK: product_id  │
                            │              │ quantity        │
                            │              │ price           │
                            │              └─────────────────┘
                            │
                            └──────────────────────┘
```

### Database Tables

#### 1. **accounts** - User information
```sql
CREATE TABLE accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
```

#### 2. **products** - Product inventory
```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL,
    rating DOUBLE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description VARCHAR(1000),
    image_url VARCHAR(1000),
    stock INTEGER NOT NULL
);
```

#### 3. **cart** - Shopping cart items
```sql
CREATE TABLE cart (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    UNIQUE(user_id, product_id),
    FOREIGN KEY(user_id) REFERENCES accounts(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
);
```

#### 4. **orders** - Order records
```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    total_price DOUBLE NOT NULL,
    order_date DATETIME NOT NULL,
    delivery_address VARCHAR(500),
    card_last_four VARCHAR(16),
    FOREIGN KEY(user_id) REFERENCES accounts(id)
);
```

#### 5. **order_items** - Items in each order
```sql
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    price DOUBLE NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
);
```

---

## Backend Flow

### Complete Request/Response Cycle

```
┌────────────────────────────────────────────────────────────────────┐
│                    BACKEND REQUEST FLOW                             │
└────────────────────────────────────────────────────────────────────┘

1. CLIENT REQUEST
   ├─ HTTP Method: GET/POST/PUT/DELETE
   ├─ Endpoint: /api/products, /api/cart, etc.
   └─ Headers: Authorization (JWT Token), Content-Type

                          ↓

2. SPRING SECURITY / CORS FILTER
   ├─ Check CORS headers
   ├─ Validate request origin
   └─ Pass request to controller

                          ↓

3. ROUTING → CONTROLLER
   ├─ Match URL pattern to controller method
   ├─ Extract path variables, request body
   └─ Validate input parameters

   Example:
   GET /api/products
   ↓
   ProductController.getAllProducts()

                          ↓

4. AUTHENTICATION & AUTHORIZATION
   ├─ Extract JWT token from header
   ├─ Validate token using JwtService
   ├─ Extract user ID from token
   └─ Return 401 if invalid

                          ↓

5. BUSINESS LOGIC → SERVICE LAYER
   ├─ Process business requirements
   ├─ Call repository methods
   ├─ Perform calculations
   └─ Prepare response data

   Example:
   OrderService.placeOrder(userId, orderRequest)
   ├─ Validate cart items
   ├─ Calculate total price
   ├─ Apply tax
   └─ Create order record

                          ↓

6. DATA ACCESS → REPOSITORY
   ├─ Build database queries (JPA)
   ├─ Execute queries
   ├─ Map results to entities
   └─ Return data to service

                          ↓

7. DATABASE QUERY
   ├─ SELECT, INSERT, UPDATE operations
   ├─ Database constraint validation
   └─ Return results via JDBC

                          ↓

8. SERVICE → CONTROLLER
   ├─ Format response data
   ├─ Set HTTP status code
   └─ Add response headers

                          ↓

9. CLIENT RESPONSE
   ├─ HTTP Status Code: 200, 201, 400, 401, etc.
   ├─ Response Body: JSON data or error message
   ├─ Headers: Content-Type, CORS headers
   └─ Error handling if exception occurred

                          ↓

10. ERROR HANDLING
    ├─ Try-Catch in controller
    ├─ Exception resolution
    ├─ Return error response with appropriate status
    └─ Log error for debugging
```

### Key Classes Involved

```
Controller Layer (REST Endpoints)
├─ AuthenticationController (/api/authentication)
│  ├─ POST /login
│  └─ POST /create-account
│
├─ ProductController (/api/products)
│  ├─ GET / (all products)
│  ├─ GET /{id} (single product)
│  └─ GET ?search=... (search products)
│
├─ CartController (/api/cart)
│  ├─ POST / (add to cart)
│  ├─ GET / (get cart items)
│  └─ DELETE /{id} (remove from cart)
│
└─ OrderController (/api/order)
   ├─ POST / (place order)
   ├─ GET /ordered-items (order history)
   └─ GET /tax-on-product/{country}

                          ↓

Service Layer (Business Logic)
├─ AuthenticationService
│  ├─ login()
│  └─ createAccount()
│
├─ ProductService
│  ├─ getAllProducts()
│  └─ searchProducts()
│
├─ CartService
│  ├─ addToCart()
│  ├─ getCartItems()
│  └─ removeFromCart()
│
└─ OrderService
   ├─ placeOrder()
   ├─ getUserOrders()
   └─ getTaxRate()

                          ↓

Repository Layer (Database Access)
├─ AccountRepository (JPA)
├─ ProductRepository
├─ CartRepository
├─ OrderRepository
└─ OrderItemRepository
```

### Authentication Flow

```
LOGIN/REGISTRATION REQUEST
         │
         ↓
┌─────────────────────────────────────┐
│  Check credentials / Create account  │
│  (Database validation)               │
└─────────────────────────────────────┘
         │
         ├─ Success: Generate JWT Token
         │
         ↓
┌─────────────────────────────────────┐
│  Return: {                          │
│    userId,                          │
│    token,                           │
│    firstName,                       │
│    lastName,                        │
│    email,                           │
│    message: "successful"            │
│  }                                  │
└─────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  Client stores token in localStorage│
│  Client stores in Redux auth state  │
└─────────────────────────────────────┘
         │
         ↓
FOR FUTURE REQUESTS:
         │
         ↓
┌─────────────────────────────────────┐
│  Include in header:                 │
│  Authorization: Bearer {token}      │
└─────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  Backend validates token            │
│  ├─ Check signature                 │
│  ├─ Check expiration (24 hours)     │
│  └─ Extract userId                  │
└─────────────────────────────────────┘
```

---

## Frontend Flow

### User Journey

```
┌──────────────────────────────────────────────────────────────────┐
│                   E-COMMERCE USER JOURNEY                        │
└──────────────────────────────────────────────────────────────────┘

FIRST TIME USER
     │
     ├─→ Land on Home Page
     │
     ├─→ Click "Register"
     │   │
     │   ├─→ Enter: firstName, lastName, email, password
     │   └─→ Submit form
     │        │
     │        ├─→ API: POST /api/authentication/create-account
     │        │
     │        ├─→ Backend validates and creates account
     │        │
     │        ├─→ Receive JWT token
     │        │
     │        └─→ Redirect to Home (logged in)
     │
     └─→ Browse Products
          │
          ├─→ View all products on Home page
          │
          ├─→ Search/Filter products
          │   └─→ API: GET /api/products?search=...
          │
          ├─→ Click "Add to Cart"
          │   │
          │   ├─→ API: POST /api/cart
          │   │   (with product ID, quantity)
          │   │
          │   └─→ Item added to cart
          │
          └─→ Go to Cart
              │
              ├─→ API: GET /api/cart (fetch items)
              │
              ├─→ Review items
              │
              ├─→ Edit quantities or remove items
              │
              └─→ Proceed to Checkout

CHECKOUT FLOW
     │
     ├─→ Review Order Summary
     │
     ├─→ Enter:
     │   ├─ Delivery Address
     │   ├─ Card Number
     │   ├─ Card Holder Name
     │   ├─ Expiry Date
     │   └─ CVV
     │
     ├─→ Click "Place Order"
     │   │
     │   ├─→ API: POST /api/order
     │   │
     │   ├─→ Backend:
     │   │   ├─ Validate cart items
     │   │   ├─ Calculate total with tax
     │   │   ├─ Create order
     │   │   ├─ Clear cart
     │   │   └─ Return order confirmation
     │   │
     │   └─→ Show "Order Placed Successfully"
     │
     └─→ View Orders
         │
         ├─→ Click "Orders"
         │
         ├─→ API: GET /api/order/ordered-items
         │
         └─→ Display order history

RETURNING USER
     │
     ├─→ Land on Home
     │
     ├─→ See "Login" button
     │
     ├─→ Enter email & password
     │   │
     │   ├─→ API: POST /api/authentication/login
     │   │
     │   ├─→ Receive JWT token
     │   │
     │   └─→ Redirect to Home (logged in)
     │
     └─→ Continue shopping or view orders
```

### State Management (Redux)

```
┌──────────────────────────────────────────────────────────┐
│               REDUX STORE STRUCTURE                      │
└──────────────────────────────────────────────────────────┘

Redux Store
├─ auth (authSlice.js)
│  ├─ user: { id, firstName, lastName, email, token }
│  ├─ isLoggedIn: boolean
│  ├─ loading: boolean
│  └─ error: string
│
├─ products (productSlice.js)
│  ├─ items: Product[]
│  ├─ loading: boolean
│  ├─ error: string
│  ├─ filters: { search, category, priceRange }
│  └─ sortBy: string
│
└─ cart (cartSlice.js)
   ├─ items: CartItem[]
   ├─ total: number
   ├─ loading: boolean
   └─ error: string

HOW DATA FLOWS:
1. Component dispatches action
2. Reducer updates state
3. Component subscribes to state changes
4. UI re-renders with new state
```

### Data Flow Example: Adding to Cart

```
User clicks "Add to Cart" button
         │
         ↓
Cart.jsx → handleAddToCart(productId, quantity)
         │
         ├─→ Calls: cartService.addToCart(productId, quantity)
         │
         ↓
cartService.js
         │
         ├─→ Makes API call: POST /api/cart
         │   {
         │     productId: 123,
         │     quantity: 2
         │   }
         │
         ├─→ Backend processes request
         │
         ├─→ Returns response: { cartId, productId, quantity, ... }
         │
         ↓
Results returned to Component
         │
         ├─→ Dispatches Redux action: addToCart(item)
         │
         ↓
Redux Reducer (cartSlice.js)
         │
         ├─→ Updates state.cart.items array
         │
         ├─→ Recalculates state.cart.total
         │
         ↓
Component re-renders
         │
         ├─→ Displays updated cart
         ├─→ Shows total price
         └─→ Shows success message
```

---

## Frontend Components

### Component Tree

```
App.jsx (Root)
│
├─ Router (React Router)
│
├─ Header.jsx
│  ├─ Navigation menu
│  ├─ Search bar
│  ├─ Cart icon with counter
│  └─ User profile / Logout
│
├─ Routes
│  │
│  ├─ Route: "/"
│  │  └─ Home.jsx
│  │     ├─ Featured products carousel
│  │     ├─ Product list
│  │     └─ Promotional banners
│  │
│  ├─ Route: "/login"
│  │  └─ Login.jsx
│  │     ├─ Email input
│  │     ├─ Password input
│  │     └─ Submit button
│  │
│  ├─ Route: "/register"
│  │  └─ Register.jsx
│  │     ├─ First Name input
│  │     ├─ Last Name input
│  │     ├─ Email input
│  │     ├─ Password input
│  │     └─ Submit button
│  │
│  ├─ Route: "/products"
│  │  └─ Products.jsx
│  │     ├─ Search filters
│  │     ├─ Category filter
│  │     ├─ Price range filter
│  │     ├─ Product grid
│  │     └─ Pagination
│  │
│  ├─ Route: "/cart"
│  │  └─ Cart.jsx
│  │     ├─ Cart items list
│  │     ├─ Item quantity controls
│  │     ├─ Remove item button
│  │     ├─ Order summary section
│  │     └─ Proceed to checkout button
│  │
│  ├─ Route: "/checkout"
│  │  └─ Checkout.jsx
│  │     ├─ Delivery address form
│  │     ├─ Payment details form
│  │     ├─ Order review
│  │     ├─ Tax calculation
│  │     └─ Place order button
│  │
│  └─ Route: "/orders"
│     └─ Orders.jsx
│        ├─ Order history list
│        ├─ Order details
│        ├─ Order date
│        └─ Order total
│
└─ Provider (Redux Provider)
   └─ Redux Store access for all components
```

### Component Details

#### 1. **Home.jsx**
```
PURPOSE: Landing page and product showcase
FEATURES:
├─ Displays featured products
├─ Shows promotional banners
├─ Browse products by category
└─ Quick access to popular items

STATE MANAGED:
├─ Redux: products list
└─ Redux: auth status
```

#### 2. **Products.jsx**
```
PURPOSE: Product browsing and filtering
FEATURES:
├─ Display all products in grid
├─ Search functionality
├─ Filter by category
├─ Filter by price range
├─ Filter by rating
├─ Sort by name/price
└─ Add to cart from product card

STATE MANAGED:
├─ Redux: products, filters, sorting
└─ Local state: search query
```

#### 3. **Cart.jsx**
```
PURPOSE: Shopping cart management
FEATURES:
├─ Display cart items
├─ Update quantities
├─ Remove items
├─ Display subtotal
├─ Show item count
└─ Proceed to checkout button

STATE MANAGED:
├─ Redux: cart items, total
└─ Local state: loading state
```

#### 4. **Checkout.jsx**
```
PURPOSE: Order placement
FEATURES:
├─ Display order summary
├─ Delivery address input
├─ Payment card details form
├─ Tax calculation
├─ Final total display
└─ Place order button

STATE MANAGED:
├─ Redux: cart items
└─ Local state: form inputs, loading
```

#### 5. **Login.jsx**
```
PURPOSE: User authentication
FEATURES:
├─ Email input
├─ Password input
├─ Error message display
├─ Loading state
└─ Link to registration

STATE MANAGED:
├─ Redux: auth state
└─ Local state: form inputs, errors
```

#### 6. **Register.jsx**
```
PURPOSE: New user registration
FEATURES:
├─ First name input
├─ Last name input
├─ Email input
├─ Password input
├─ Error validation
└─ Link to login

STATE MANAGED:
├─ Redux: auth state
└─ Local state: form inputs, errors
```

#### 7. **Header.jsx**
```
PURPOSE: Navigation and branding
FEATURES:
├─ Navigation menu
├─ Logo/Home link
├─ Search bar
├─ Cart icon with item count
├─ User profile menu
└─ Logout button

STATE MANAGED:
├─ Redux: auth state (user info)
└─ Redux: cart (item count)
```

#### 8. **Orders.jsx**
```
PURPOSE: Order history display
FEATURES:
├─ List all user orders
├─ Show order date
├─ Display order items
├─ Show order total
└─ Order status

STATE MANAGED:
├─ Redux: auth state (user ID)
└─ Local state: orders list, loading
```

### Service Layer Communication

```
Services Handle API Communication
├─ authService.js
│  ├─ login(email, password)
│  ├─ createAccount(firstName, lastName, email, password)
│  ├─ logout()
│  ├─ getUser()
│  └─ isLoggedIn()
│
├─ productService.js
│  ├─ getAllProducts(filters)
│  ├─ searchProducts(query)
│  └─ getProductById(id)
│
├─ cartService.js
│  ├─ addToCart(productId, quantity)
│  ├─ getCartItems()
│  └─ removeFromCart(cartId)
│
├─ orderService.js
│  ├─ placeOrder(items, deliveryAddress, cardDetails)
│  ├─ getOrderedItems()
│  └─ getTaxRate(country)
│
└─ api.js (Axios Configuration)
   ├─ Base URL: http://localhost:8080/api
   ├─ Interceptors for token injection
   └─ Error handling
```

---

## API Endpoints

### Authentication Endpoints

```
1. LOGIN
   POST /api/authentication/login
   
   Request:
   {
     "email": "user@example.com",
     "password": "password123"
   }
   
   Response (200):
   {
     "id": 1,
     "firstName": "John",
     "lastName": "Doe",
     "email": "user@example.com",
     "token": "eyJhbGciOiJIUzI1NiIs...",
     "message": "Login successful"
   }

2. CREATE ACCOUNT
   POST /api/authentication/create-account
   
   Request:
   {
     "firstName": "John",
     "lastName": "Doe",
     "email": "user@example.com",
     "password": "password123"
   }
   
   Response (201):
   {
     "id": 1,
     "firstName": "John",
     "lastName": "Doe",
     "email": "user@example.com",
     "token": "eyJhbGciOiJIUzI1NiIs...",
     "message": "Account created successfully"
   }
```

### Product Endpoints

```
1. GET ALL PRODUCTS
   GET /api/products
   
   Response (200):
   [
     {
       "id": 1,
       "name": "Wireless Headphones",
       "price": 79.99,
       "rating": 4.5,
       "category": "Electronics",
       "description": "High-quality wireless headphones",
       "imageUrl": "https://...",
       "stock": 50
     },
     ...
   ]

2. SEARCH PRODUCTS
   GET /api/products?search=headphones&minPrice=50&maxPrice=100
   
   Query Parameters:
   - search: product name or description
   - category: filter by category
   - minPrice, maxPrice: price range
   - minRating, maxRating: rating range
   - sortBy: name, price, rating
   - order: asc, desc
```

### Cart Endpoints

```
1. ADD TO CART
   POST /api/cart
   Headers: Authorization: Bearer {token}
   
   Request:
   {
     "productId": 1,
     "quantity": 2
   }
   
   Response (200):
   {
     "cartId": 5,
     "productId": 1,
     "quantity": 2,
     "price": 79.99,
     "productName": "Wireless Headphones"
   }

2. GET CART ITEMS
   GET /api/cart
   Headers: Authorization: Bearer {token}
   
   Response (200):
   {
     "items": [
       {
         "cartId": 5,
         "productId": 1,
         "quantity": 2,
         "price": 79.99,
         "productName": "Wireless Headphones"
       }
     ],
     "total": 159.98
   }

3. REMOVE FROM CART
   DELETE /api/cart/{cartId}
   Headers: Authorization: Bearer {token}
   
   Response (200): Item removed
```

### Order Endpoints

```
1. PLACE ORDER
   POST /api/order
   Headers: Authorization: Bearer {token}
   
   Request:
   {
     "items": [
       {"productId": 1, "quantity": 2},
       {"productId": 3, "quantity": 1}
     ],
     "deliveryAddress": "123 Main St, City",
     "cardNumber": "4532123456789010",
     "cardHolderName": "John Doe",
     "expiryDate": "12/25",
     "cvv": "123"
   }
   
   Response (201):
   {
     "id": 1,
     "userId": 1,
     "totalPrice": 239.97,
     "orderDate": "2025-11-23T16:20:00",
     "deliveryAddress": "123 Main St, City",
     "cardLastFour": "9010",
     "message": "Order placed successfully"
   }

2. GET ORDER HISTORY
   GET /api/order/ordered-items
   Headers: Authorization: Bearer {token}
   
   Response (200):
   {
     "orders": [
       {
         "id": 1,
         "userId": 1,
         "items": [...],
         "totalPrice": 239.97,
         "orderDate": "2025-11-23T16:20:00"
       }
     ],
     "count": 1
   }

3. GET TAX RATE
   GET /api/order/tax-on-product/{country}
   
   Response (200):
   {
     "country": "US",
     "taxRate": 0.08,
     "taxPercentage": 8.0
   }
```

---

## Technology Stack

### Backend Technologies

| Technology | Purpose | Version |
|-----------|---------|---------|
| Java | Programming Language | 17+ |
| Spring Boot | Framework | 3.2.0 |
| Spring Security | Authentication/Authorization | 6.1.1 |
| Spring Data JPA | ORM & Data Access | 3.2.0 |
| Hibernate | ORM Implementation | 6.2 |
| MySQL | Database | 8.0+ |
| JWT | Token-based Authentication | io.jsonwebtoken |
| Lombok | Boilerplate reduction | 1.18.30 |
| Maven | Build Tool | 3.8+ |

### Frontend Technologies

| Technology | Purpose | Version |
|-----------|---------|---------|
| React | UI Library | 18.2.0 |
| Redux | State Management | 4.2.1 |
| Redux Toolkit | Redux utilities | 1.9.7 |
| React Router | Navigation | 6.20.0 |
| Axios | HTTP Client | 1.6.2 |
| Tailwind CSS | Styling | 3.3.6 |
| Vite | Build Tool | 7.2.4 |
| PostCSS | CSS Processing | 8.4.31 |
| Node.js | Runtime | 14.0+ |
| npm | Package Manager | 6.0+ |

### Security Features

```
┌──────────────────────────────────────────┐
│         SECURITY IMPLEMENTATION          │
└──────────────────────────────────────────┘

1. JWT Authentication
   ├─ Generate token on login/registration
   ├─ Token includes: userId, email, expiration
   ├─ Token valid for 24 hours
   └─ Token sent in Authorization header

2. CORS (Cross-Origin Resource Sharing)
   ├─ Allowed origins: http://localhost:3000, http://localhost:5173
   ├─ Allowed methods: GET, POST, PUT, DELETE, OPTIONS
   ├─ Allowed headers: *
   └─ Credentials: Enabled

3. Spring Security
   ├─ RequestMatchers for public/protected routes
   ├─ JWT filter for token validation
   ├─ Exception handling for auth failures
   └─ Method-level security annotations

4. Password Security
   ├─ BCrypt password encoding
   ├─ Never store plain text passwords
   └─ Validate password on login

5. Database Security
   ├─ Unique email constraint
   ├─ Foreign key relationships
   ├─ NOT NULL constraints
   └─ SQL injection prevention via JPA
```

---

## Getting Started

### Prerequisites
- Java 17+
- Node.js 14+
- MySQL 8.0+
- Git

### Backend Setup

```bash
# 1. Clone the project
git clone <repository-url>
cd EcomerceProj

# 2. Create MySQL database
mysql -u root -p
CREATE DATABASE ecommerce_db;

# 3. Build the project
./gradlew clean build

# 4. Run the application
./gradlew bootRun
# OR
java -jar build/libs/EcomerceProj-1.0-SNAPSHOT.jar

# Backend runs on http://localhost:8080
```

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# Frontend runs on http://localhost:5173
```

### Testing API Endpoints

```bash
# Using curl

# 1. Register a new user
curl -X POST http://localhost:8080/api/authentication/create-account \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# 2. Get all products
curl http://localhost:8080/api/products

# 3. Add to cart (with token)
curl -X POST http://localhost:8080/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot connect to MySQL" | Ensure MySQL is running: `mysql.server start` |
| "Port 8080 already in use" | Change port in `application.yml`: `server.port: 8081` |
| "CORS error" | Check `SecurityConfig.java` CORS settings |
| "JWT token invalid" | Token may be expired or malformed |
| "Cannot find module" (Frontend) | Run `npm install` again |
| "npm ERR! 404 not found" | Check internet connection and npm registry |

---

## Key Concepts for Beginners

### 1. **REST API**
Representational State Transfer - Uses HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources.

### 2. **JWT (JSON Web Token)**
A token that proves you're authenticated. Sent with every request to prove who you are.

### 3. **CORS (Cross-Origin Resource Sharing)**
Allows frontend (port 5173) to communicate with backend (port 8080).

### 4. **Redux**
Centralized state management for React. Stores user, products, cart data in one place accessible to all components.

### 5. **Entity-Relationship (ER) Model**
Shows how database tables relate to each other through foreign keys.

### 6. **ORM (Object-Relational Mapping)**
Hibernate automatically maps database tables to Java objects.

### 7. **Spring Boot Annotations**
- `@RestController`: Marks class as REST API endpoint
- `@GetMapping`: Maps GET request to method
- `@PostMapping`: Maps POST request to method
- `@Autowired`: Injects dependencies automatically
- `@Entity`: Marks class as database table

### 8. **HTTP Status Codes**
- 200: OK (successful GET/PUT)
- 201: Created (successful POST)
- 400: Bad Request (invalid input)
- 401: Unauthorized (authentication failed)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error

---

## Summary

This e-commerce application demonstrates a complete full-stack development:

✅ **Backend**: Spring Boot with JWT authentication, REST APIs, and database management  
✅ **Frontend**: React with Redux for state management and Axios for API calls  
✅ **Database**: MySQL with properly designed schema and relationships  
✅ **Security**: CORS, JWT, and Spring Security implementation  
✅ **Best Practices**: Separation of concerns, error handling, and clean code structure  

By understanding this architecture, you can:
- Build scalable applications
- Manage frontend and backend communication
- Design efficient databases
- Implement secure authentication
- Use modern frameworks and tools

**Happy learning! 🚀**

