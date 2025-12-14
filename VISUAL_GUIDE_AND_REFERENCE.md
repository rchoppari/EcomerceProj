# E-Commerce Application - Visual Diagrams & Quick Reference Guide

## Quick Start Diagrams

### 1. System Overview Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                      E-COMMERCE APP OVERVIEW                      │
└────────────────────────────────────────────────────────────────────┘

                          USERS
                            │
                    ┌───────┴────────┐
                    │                │
              ┌─────────────┐   ┌─────────────┐
              │   Browser   │   │  Mobile App │
              │ (React)     │   │   (React)   │
              └──────┬──────┘   └──────┬──────┘
                     │                 │
                     └────────┬────────┘
                              │
                        HTTPS/CORS
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌─────────────┐  ┌──────────────────┐  ┌──────────────┐
   │ Product API │  │ Authentication   │  │ Cart & Order │
   │             │  │ API              │  │ APIs         │
   └─────────────┘  └──────────────────┘  └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    Spring Boot (Java)
                    Port 8080
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
    ┌────────┐         ┌──────────┐         ┌──────────┐
    │JWT Auth│         │Business  │         │Database  │
    │        │         │Logic     │         │Access    │
    │        │         │          │         │          │
    └────────┘         └──────────┘         └──────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                        MySQL Database
                        ecommerce_db
                              │
        ┌─────────────────────┼─────────────────────┐
        │         │         │         │         │
    ┌────────┐ ┌────────┐ ┌──────┐ ┌──────┐ ┌────────┐
    │accounts│ │products│ │ cart │ │orders│ │items   │
    └────────┘ └────────┘ └──────┘ └──────┘ └────────┘
```

---

### 2. User Flow Diagram

```
START
  │
  ├─→ New User?
  │    │
  │    ├─ Yes → Register
  │    │        ├─ Enter: firstName, lastName, email, password
  │    │        ├─ API: POST /api/authentication/create-account
  │    │        └─ Get JWT token
  │    │
  │    └─ No → Login
  │             ├─ Enter: email, password
  │             ├─ API: POST /api/authentication/login
  │             └─ Get JWT token
  │
  ├─→ LOGGED IN ✓
  │
  ├─→ Browse Products
  │    ├─ API: GET /api/products
  │    ├─ View product list
  │    └─ Search/filter products
  │
  ├─→ Add to Cart
  │    ├─ Click "Add to Cart"
  │    ├─ API: POST /api/cart (with JWT token)
  │    └─ Item added to cart
  │
  ├─→ View Shopping Cart
  │    ├─ Navigate to /cart
  │    ├─ API: GET /api/cart (with JWT token)
  │    ├─ Review items
  │    └─ Edit quantities / Remove items
  │
  ├─→ Proceed to Checkout
  │    ├─ Navigate to /checkout
  │    ├─ Enter delivery address
  │    ├─ Enter payment details
  │    ├─ Review order total (with tax)
  │    └─ Click "Place Order"
  │
  ├─→ Place Order
  │    ├─ API: POST /api/order (with JWT token)
  │    ├─ Order created in database
  │    ├─ Cart cleared
  │    └─ Order confirmation shown
  │
  ├─→ View Order History
  │    ├─ Navigate to /orders
  │    ├─ API: GET /api/order/ordered-items (with JWT token)
  │    └─ Display all past orders
  │
  └─→ Logout
       ├─ Click "Logout"
       ├─ Token removed
       ├─ Redux state cleared
       └─ Redirect to login

END
```

---

### 3. Component Hierarchy

```
App.jsx (Root Component)
│
├─ Provider (Redux)
│  │
│  ├─ Router (React Router)
│  │  │
│  │  ├─ Header.jsx (Navigation)
│  │  │  ├─ Logo / Home Link
│  │  │  ├─ Search Bar
│  │  │  ├─ Cart Icon (with counter)
│  │  │  └─ User Menu / Logout
│  │  │
│  │  └─ Routes:
│  │     │
│  │     ├─ "/" → Home.jsx
│  │     │  ├─ Featured Products
│  │     │  ├─ Product Grid
│  │     │  └─ Promotional Content
│  │     │
│  │     ├─ "/login" → Login.jsx
│  │     │  ├─ Email Input
│  │     │  ├─ Password Input
│  │     │  ├─ Submit Button
│  │     │  └─ Register Link
│  │     │
│  │     ├─ "/register" → Register.jsx
│  │     │  ├─ First Name Input
│  │     │  ├─ Last Name Input
│  │     │  ├─ Email Input
│  │     │  ├─ Password Input
│  │     │  ├─ Submit Button
│  │     │  └─ Login Link
│  │     │
│  │     ├─ "/products" → Products.jsx
│  │     │  ├─ Search Filter
│  │     │  ├─ Category Filter
│  │     │  ├─ Price Range Filter
│  │     │  ├─ Product Grid
│  │     │  │  └─ Product Card (each)
│  │     │  │     ├─ Image
│  │     │  │     ├─ Name
│  │     │  │     ├─ Price
│  │     │  │     ├─ Rating
│  │     │  │     └─ "Add to Cart" Button
│  │     │  └─ Pagination
│  │     │
│  │     ├─ "/cart" → Cart.jsx
│  │     │  ├─ Cart Items List
│  │     │  │  └─ Cart Item (each)
│  │     │  │     ├─ Product Name
│  │     │  │     ├─ Price
│  │     │  │     ├─ Quantity Input
│  │     │  │     └─ Remove Button
│  │     │  ├─ Order Summary Section
│  │     │  │  ├─ Subtotal
│  │     │  │  ├─ Tax
│  │     │  │  └─ Total
│  │     │  └─ "Proceed to Checkout" Button
│  │     │
│  │     ├─ "/checkout" → Checkout.jsx
│  │     │  ├─ Order Review
│  │     │  ├─ Delivery Address Form
│  │     │  ├─ Payment Details Form
│  │     │  │  ├─ Card Number
│  │     │  │  ├─ Card Holder Name
│  │     │  │  ├─ Expiry Date
│  │     │  │  └─ CVV
│  │     │  ├─ Order Summary
│  │     │  │  ├─ Subtotal
│  │     │  │  ├─ Tax Calculation
│  │     │  │  └─ Total
│  │     │  └─ "Place Order" Button
│  │     │
│  │     └─ "/orders" → Orders.jsx
│  │        └─ Order History List
│  │           └─ Order Item (each)
│  │              ├─ Order ID
│  │              ├─ Order Date
│  │              ├─ Items List
│  │              ├─ Total Price
│  │              └─ Delivery Status
```

---

### 4. Data Models (Simplified)

```
ACCOUNT (User)
┌─────────────────────────┐
│ id: Long (PK)           │
│ firstName: String       │
│ lastName: String        │
│ email: String (UNIQUE)  │
│ password: String        │
└─────────────────────────┘
         │
    1    │    Many
    ───┬─┴──┬───
       │    │
    CART  ORDERS
       │    │
       │    └─→ ORDER_ITEMS ──→ PRODUCT

PRODUCT
┌──────────────────────────┐
│ id: Long (PK)            │
│ name: String             │
│ price: Double            │
│ rating: Double           │
│ category: String         │
│ description: String      │
│ imageUrl: String         │
│ stock: Integer           │
└──────────────────────────┘

CART
┌──────────────────────────┐
│ id: Long (PK)            │
│ user_id: Long (FK)       │ → references ACCOUNT
│ product_id: Long (FK)    │ → references PRODUCT
│ quantity: Integer        │
├──────────────────────────┤
│ UNIQUE(user_id,          │
│        product_id)       │
└──────────────────────────┘

ORDER
┌──────────────────────────┐
│ id: Long (PK)            │
│ user_id: Long (FK)       │ → references ACCOUNT
│ totalPrice: Double       │
│ orderDate: DateTime      │
│ deliveryAddress: String  │
│ cardLastFour: String     │
└──────────────────────────┘
         │
         │ 1
         │ ──→ Many
         │
    ORDER_ITEMS
    ┌──────────────────────────┐
    │ id: Long (PK)            │
    │ order_id: Long (FK)      │ → ORDER
    │ product_id: Long (FK)    │ → PRODUCT
    │ quantity: Integer        │
    │ price: Double            │
    └──────────────────────────┘
```

---

### 5. API Endpoint Quick Reference

```
┌─────────────────────────────────────────────────────────┐
│              API ENDPOINTS OVERVIEW                    │
└─────────────────────────────────────────────────────────┘

AUTHENTICATION (No JWT needed for these)
├─ POST   /api/authentication/login
├─ POST   /api/authentication/create-account
└─ Status: 200 (success), 401 (auth failed)

PRODUCTS (No JWT needed)
├─ GET    /api/products
├─ GET    /api/products?search=headphones
├─ GET    /api/products?category=Electronics
├─ GET    /api/products?minPrice=50&maxPrice=100
└─ Status: 200 (success)

CART (JWT Required)
├─ POST   /api/cart (add to cart)
├─ GET    /api/cart (get cart items)
├─ DELETE /api/cart/{cartId} (remove item)
└─ Status: 200/201 (success), 401 (auth needed)

ORDERS (JWT Required)
├─ POST   /api/order (place order)
├─ GET    /api/order/ordered-items (order history)
├─ GET    /api/order/tax-on-product/{country}
└─ Status: 200/201 (success), 401 (auth needed)

STATUS CODES:
├─ 200: OK (successful GET, PUT, DELETE)
├─ 201: Created (successful POST)
├─ 400: Bad Request (invalid input)
├─ 401: Unauthorized (missing/invalid JWT)
├─ 404: Not Found (resource doesn't exist)
└─ 500: Server Error (unexpected error)
```

---

### 6. Technology Stack Cheat Sheet

```
┌──────────────────────────────────────────────────────┐
│               TECHNOLOGY STACK                       │
└──────────────────────────────────────────────────────┘

BACKEND (Java)
├─ Framework: Spring Boot 3.2.0
├─ Security: Spring Security + JWT
├─ ORM: Hibernate + JPA
├─ Database: MySQL 8.0+
├─ Build: Gradle 8.x
├─ Runtime: Java 17+
└─ Server: Tomcat (embedded)

FRONTEND (JavaScript)
├─ UI Library: React 18.2.0
├─ State: Redux + Redux Toolkit 1.9.7
├─ Routing: React Router 6.20.0
├─ HTTP: Axios 1.6.2
├─ Styling: Tailwind CSS 3.3.6
├─ Build: Vite 7.2.4
├─ Runtime: Node.js 14+
└─ Package: npm 6+

DATABASE
├─ DBMS: MySQL 8.0+
├─ Connection: JDBC
├─ Driver: mysql-connector-java
└─ Port: 3306

COMMUNICATION
├─ Protocol: HTTP/HTTPS
├─ Format: JSON
├─ CORS: Enabled
├─ Authentication: JWT (24h expiry)
└─ Front-end port: 5173
    Back-end port: 8080
    DB port: 3306
```

---

### 7. Redux State Structure

```
REDUX STORE STRUCTURE
├─ auth (authSlice)
│  ├─ user: {
│  │  ├─ id: number
│  │  ├─ firstName: string
│  │  ├─ lastName: string
│  │  ├─ email: string
│  │  ├─ token: string
│  │  └─ message: string
│  │}
│  ├─ isLoggedIn: boolean
│  ├─ loading: boolean
│  └─ error: string
│
├─ products (productSlice)
│  ├─ items: [{
│  │  ├─ id: number
│  │  ├─ name: string
│  │  ├─ price: number
│  │  ├─ rating: number
│  │  ├─ category: string
│  │  ├─ description: string
│  │  ├─ imageUrl: string
│  │  └─ stock: number
│  │}]
│  ├─ loading: boolean
│  ├─ error: string
│  └─ filters: {
│     ├─ search: string
│     ├─ category: string
│     ├─ minPrice: number
│     ├─ maxPrice: number
│     └─ sortBy: string
│}
│
└─ cart (cartSlice)
   ├─ items: [{
   │  ├─ cartId: number
   │  ├─ productId: number
   │  ├─ quantity: number
   │  ├─ price: number
   │  └─ productName: string
   │}]
   ├─ total: number
   ├─ loading: boolean
   └─ error: string
```

---

### 8. Common Workflows

```
┌──────────────────────────────────────────┐
│    WORKFLOW 1: USER REGISTRATION         │
└──────────────────────────────────────────┘

Frontend               Backend              Database
   │                     │                      │
   │─ Fill Form ─→       │                      │
   │                     │─ Validate Input ─→   │
   │                     │                  Check email exists?
   │                     │ ← NO ─────────────────│
   │                     │                      │
   │                     │─ Create Account ────→│
   │                     │                  INSERT
   │                     │ ← Success ───────────│
   │                     │                      │
   │ ← JWT Token ────────│                      │
   │                     │                      │
   Store in localStorage │                      │
   Store in Redux        │                      │
   Redirect to Home      │                      │

┌──────────────────────────────────────────┐
│    WORKFLOW 2: ADD TO CART               │
└──────────────────────────────────────────┘

Frontend               Backend              Database
   │                     │                      │
   │ Click "Add" ─→      │                      │
   │ (with JWT)          │                      │
   │                     │─ Validate JWT ─→     │
   │                     │ ← Valid ────────────│
   │                     │                      │
   │                     │─ Get userId ─→       │
   │                     │ ← userId ───────────│
   │                     │                      │
   │                     │─ Check if in cart ──→│
   │                     │ ← YES/NO ───────────│
   │                     │                      │
   │                     │─ INSERT/UPDATE ────→│
   │                     │ ← Success ──────────│
   │                     │                      │
   │ ← Cart Item ────────│                      │
   │                     │                      │
   Update Redux state    │                      │
   Show toast message    │                      │
   Update cart counter   │                      │

┌──────────────────────────────────────────┐
│    WORKFLOW 3: PLACE ORDER               │
└──────────────────────────────────────────┘

Frontend               Backend              Database
   │                     │                      │
   │ Submit Order ─→     │                      │
   │ (with JWT, items,   │                      │
   │  address, card)     │                      │
   │                     │─ Validate JWT ─→     │
   │                     │ ← Valid ────────────│
   │                     │                      │
   │                     │─ Get Cart Items ────→│
   │                     │ ← Cart ─────────────│
   │                     │                      │
   │                     │─ Create Order ─────→│
   │                     │ ← Order ID ────────│
   │                     │                      │
   │                     │─ Create OrderItems ─│
   │                     │ ← Success ──────────│
   │                     │                      │
   │                     │─ Clear Cart ───────→│
   │                     │ ← Success ──────────│
   │                     │                      │
   │ ← Confirmation ─────│                      │
   │                     │                      │
   Clear Redux cart      │                      │
   Show success msg      │                      │
   Redirect to orders    │                      │
```

---

### 9. Error Handling Guide

```
┌──────────────────────────────────────────┐
│        ERROR CODES & SOLUTIONS           │
└──────────────────────────────────────────┘

ERROR 401 UNAUTHORIZED
├─ Cause: Invalid or missing JWT token
├─ When: Protected API calls without token
├─ Solution: 
│  ├─ Check token in localStorage
│  ├─ If missing → Redirect to login
│  ├─ If expired → Login again (24h expiry)
│  └─ Verify "Authorization: Bearer {token}"

ERROR 400 BAD REQUEST
├─ Cause: Invalid input/validation failed
├─ When: Form submission with wrong data
├─ Solution:
│  ├─ Check required fields filled
│  ├─ Validate email format
│  ├─ Validate card number format
│  ├─ Check amount > 0
│  └─ Review API documentation

ERROR 404 NOT FOUND
├─ Cause: Resource doesn't exist
├─ When: API endpoint wrong or resource deleted
├─ Solution:
│  ├─ Check URL spelling
│  ├─ Verify resource exists in DB
│  ├─ Check path parameters
│  └─ Verify API version

ERROR 500 SERVER ERROR
├─ Cause: Unexpected error on backend
├─ When: Unhandled exception
├─ Solution:
│  ├─ Check server logs
│  ├─ Verify database connection
│  ├─ Check database size/space
│  ├─ Restart backend
│  └─ Contact backend team

CORS ERROR (Frontend)
├─ Cause: CORS policy violation
├─ When: Frontend and backend ports differ
├─ Solution:
│  ├─ Verify CORS enabled in SecurityConfig
│  ├─ Check allowed origins
│  ├─ Ensure credentials: true if needed
│  ├─ Check preflight requests
│  └─ Clear browser cache

JWT EXPIRED
├─ Cause: Token older than 24 hours
├─ When: Using old token
├─ Solution:
│  ├─ Auto-logout and redirect to login
│  ├─ Implement refresh token mechanism
│  ├─ Show "Session expired" message
│  └─ Clear localStorage
```

---

### 10. Performance Tips

```
┌──────────────────────────────────────────┐
│        PERFORMANCE OPTIMIZATION          │
└──────────────────────────────────────────┘

FRONTEND
├─ React Component Optimization
│  ├─ Use React.memo() for pure components
│  ├─ Use useCallback() to memoize functions
│  ├─ Use useMemo() for expensive calculations
│  └─ Avoid unnecessary re-renders
│
├─ Redux Optimization
│  ├─ Keep state flat (avoid deeply nested)
│  ├─ Use selectors to memoize derived data
│  ├─ Split reducers by domain
│  └─ Use Redux DevTools for debugging
│
├─ API Calls
│  ├─ Cache responses (localStorage)
│  ├─ Debounce search input
│  ├─ Implement pagination
│  ├─ Lazy load images
│  └─ Use CDN for static assets
│
└─ Build Optimization
   ├─ Code splitting with dynamic imports
   ├─ Minify CSS/JS
   ├─ Tree shaking unused code
   ├─ Compress images
   └─ Use gzip compression

BACKEND
├─ Database
│  ├─ Create indexes on frequently queried columns
│  ├─ Use pagination for large result sets
│  ├─ Avoid N+1 query problems
│  ├─ Use connection pooling
│  └─ Optimize slow queries
│
├─ API
│  ├─ Implement caching (Redis)
│  ├─ Use DTOs instead of entities
│  ├─ Batch API calls when possible
│  ├─ Return only needed fields
│  └─ Implement pagination
│
├─ Infrastructure
│  ├─ Use CDN for static files
│  ├─ Load balancing for multiple instances
│  ├─ Enable compression (gzip)
│  ├─ Use async processing for heavy tasks
│  └─ Monitor and alert on metrics
│
└─ Code
   ├─ Use proper logging levels
   ├─ Avoid blocking operations
   ├─ Implement timeouts
   ├─ Use thread pools
   └─ Monitor memory usage
```

---

## Quick Reference Commands

```bash
# BACKEND COMMANDS

# Build
./gradlew clean build

# Run
./gradlew bootRun
java -jar build/libs/EcomerceProj-1.0-SNAPSHOT.jar

# Test
./gradlew test

# Database Init (from SQL file)
mysql -u root -p ecommerce_db < mysql-setup-script.sql

# View logs
tail -f logs/app.log


# FRONTEND COMMANDS

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint


# USEFUL CURL COMMANDS

# Register
curl -X POST http://localhost:8080/api/authentication/create-account \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:8080/api/authentication/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'

# Get Products
curl http://localhost:8080/api/products

# Add to Cart (replace TOKEN with actual token)
curl -X POST http://localhost:8080/api/cart \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":2}'

# Get Cart
curl -X GET http://localhost:8080/api/cart \
  -H "Authorization: Bearer TOKEN"
```

---

This visual guide provides quick reference for understanding and developing this e-commerce application!

