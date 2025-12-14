# E-Commerce Application - Detailed Architecture & Design Documentation

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Request-Response Cycle](#request-response-cycle)
3. [Data Flow Diagrams](#data-flow-diagrams)
4. [Component Interaction](#component-interaction)
5. [Authentication Flow](#authentication-flow)
6. [Order Processing Flow](#order-processing-flow)
7. [Development Workflow](#development-workflow)
8. [Deployment Architecture](#deployment-architecture)

---

## System Architecture

### High-Level Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   PRESENTATION TIER (Frontend)                  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 React Application                        │   │
│  │  Port: 5173                                              │   │
│  │                                                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐   │   │
│  │  │   Components │  │ Redux Store  │  │  Services   │   │   │
│  │  │   (JSX)      │  │  (State)     │  │  (HTTP)     │   │   │
│  │  └──────────────┘  └──────────────┘  └─────────────┘   │   │
│  │         │                  │                │             │   │
│  │         └──────────────────┴────────────────┘             │   │
│  │                      │                                    │   │
│  └──────────────────────┼────────────────────────────────────┘   │
│                         │                                         │
│      Axios HTTP Client  │ (CORS Enabled)                         │
│                         │                                         │
├─────────────────────────┼─────────────────────────────────────────┤
│                         │                                         │
│  ┌──────────────────────↓──────────────────────────────────────┐ │
│  │                BUSINESS TIER (Backend)                      │ │
│  │                                                              │ │
│  │  Port: 8080 | Spring Boot Application                       │ │
│  │                                                              │ │
│  │  ┌──────────────────┐  ┌──────────────────┐               │ │
│  │  │   Controllers    │→ │    Services      │               │ │
│  │  │ (Request Entry   │  │  (Business Logic)│               │ │
│  │  │  Points)         │  │  ├─ Validation   │               │ │
│  │  └──────────────────┘  │  ├─ Calculation  │               │ │
│  │         ↑               │  └─ Processing   │               │ │
│  │         │               └──────────────────┘               │ │
│  │    Routing              │                                   │ │
│  │                         │                                   │ │
│  │  ┌─────────────────────────────────────┐                  │ │
│  │  │  Security Filters (CORS, JWT)       │                  │ │
│  │  └─────────────────────────────────────┘                  │ │
│  │         ↓                                                   │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │          Repository Layer (Data Access)              │  │ │
│  │  │  ├─ AccountRepository                                │  │ │
│  │  │  ├─ ProductRepository                                │  │ │
│  │  │  ├─ CartRepository                                   │  │ │
│  │  │  ├─ OrderRepository                                  │  │ │
│  │  │  └─ OrderItemRepository                              │  │ │
│  │  │  (All use JPA/Hibernate ORM)                         │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │         │                                                   │ │
│  │         ↓                                                   │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │        JPA/Hibernate (ORM)                           │  │ │
│  │  │  ├─ Object-Relational Mapping                        │  │ │
│  │  │  ├─ Query Generation                                 │  │ │
│  │  │  └─ Transaction Management                           │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                         │                                         │
│              JDBC Driver│ (SQL Queries)                          │
│                         │                                         │
├─────────────────────────┼─────────────────────────────────────────┤
│                         │                                         │
│  ┌──────────────────────↓──────────────────────────────────────┐ │
│  │            DATA TIER (Database)                            │ │
│  │                                                              │ │
│  │  MySQL Database - ecommerce_db                             │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  Tables:                                             │  │ │
│  │  │  ├─ accounts (User information)                      │  │ │
│  │  │  ├─ products (Product catalog)                       │  │ │
│  │  │  ├─ cart (Shopping carts)                            │  │ │
│  │  │  ├─ orders (Order history)                           │  │ │
│  │  │  └─ order_items (Items in orders)                    │  │ │
│  │  │                                                       │  │ │
│  │  │  Indexes: Primary keys, Foreign keys, Unique         │  │ │
│  │  │           constraints for performance                │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request-Response Cycle

### Detailed HTTP Request Flow

```
┌───────────────────────────────────────────────────────────────────┐
│                      COMPLETE REQUEST FLOW                        │
└───────────────────────────────────────────────────────────────────┘

STEP 1: CLIENT INITIATES REQUEST
┌─────────────────────────────────────────────────────────────────┐
│ Browser/React Component                                         │
│                                                                 │
│ Example: User clicks "Get Cart Items"                          │
│                                                                 │
│ ├─ Create HTTP Request:                                         │
│ │  ├─ Method: GET                                              │
│ │  ├─ URL: http://localhost:8080/api/cart                     │
│ │  ├─ Headers: {                                               │
│ │  │    Authorization: Bearer eyJhbGciOiJIUzI1NiIs...,        │
│ │  │    Content-Type: application/json                        │
│ │  }                                                            │
│ │  └─ Body: (empty for GET)                                    │
│ │                                                               │
│ └─ Send via Axios HTTP client                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
STEP 2: BROWSER PREPARES REQUEST
┌─────────────────────────────────────────────────────────────────┐
│ Browser Network Layer                                           │
│                                                                 │
│ ├─ Check for CORS issues                                        │
│ ├─ Add browser default headers                                  │
│ ├─ Establish TCP connection to localhost:8080                  │
│ └─ Send HTTP request                                            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
STEP 3: SPRING BOOT RECEIVES REQUEST
┌─────────────────────────────────────────────────────────────────┐
│ Tomcat Server (Spring Boot embedded)                            │
│                                                                 │
│ ├─ Receives HTTP request on port 8080                          │
│ ├─ Parses request line: GET /api/cart HTTP/1.1                 │
│ ├─ Parses headers                                               │
│ └─ Creates ServletRequest object                               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
STEP 4: CORS FILTER
┌─────────────────────────────────────────────────────────────────┐
│ CorsFilter (Custom)                                             │
│                                                                 │
│ ├─ Check request origin:                                        │
│ │  ├─ Is it http://localhost:5173? ✓                           │
│ │  └─ Is it http://localhost:3000? ✓                           │
│ │                                                               │
│ ├─ Check request method:                                        │
│ │  ├─ Is GET in allowed methods? ✓                             │
│ │                                                               │
│ ├─ Check request headers:                                       │
│ │  ├─ Are they allowed? ✓                                      │
│ │                                                               │
│ ├─ Add CORS response headers:                                   │
│ │  ├─ Access-Control-Allow-Origin: http://localhost:5173      │
│ │  ├─ Access-Control-Allow-Methods: GET, POST, ...            │
│ │  └─ Access-Control-Allow-Headers: *                          │
│ │                                                               │
│ └─ Allow request to proceed ✓                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
STEP 5: SPRING SECURITY FILTER CHAIN
┌─────────────────────────────────────────────────────────────────┐
│ Security Filter Chain                                           │
│                                                                 │
│ ├─ Extract JWT token from Authorization header:                │
│ │  ├─ Token: eyJhbGciOiJIUzI1NiIs...                           │
│ │                                                               │
│ ├─ Validate JWT token:                                          │
│ │  ├─ Check signature (using secret key)                       │
│ │  ├─ Check if expired (should be within 24 hours)             │
│ │  ├─ Extract claims: userId, email                            │
│ │  └─ Token valid? ✓                                            │
│ │                                                               │
│ ├─ Extract userId from token:                                   │
│ │  ├─ userId = 5                                               │
│ │                                                               │
│ ├─ Add to request context:                                      │
│ │  ├─ So controller can access current user                    │
│ │                                                               │
│ └─ Allow request to proceed ✓                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
STEP 6: ROUTING
┌─────────────────────────────────────────────────────────────────┐
│ DispatcherServlet (Route Matching)                              │
│                                                                 │
│ ├─ Look for matching controller:                                │
│ │  ├─ URL: /api/cart                                           │
│ │  ├─ Method: GET                                              │
│ │                                                               │
│ ├─ Find mapping:                                                │
│ │  ├─ @GetMapping("/") in CartController ✓                     │
│ │                                                               │
│ ├─ Extract path variables: (none in this case)                  │
│ │                                                               │
│ └─ Route to: CartController.getCartItems(@RequestHeader token) │
└─────────────────────────────────────────────────────────────────┘
                            ↓
STEP 7: CONTROLLER EXECUTION
┌─────────────────────────────────────────────────────────────────┐
│ CartController                                                  │
│                                                                 │
│ public ResponseEntity<?> getCartItems(                          │
│     @RequestHeader(value = "Authorization", required = false)   │
│     String token) {                                             │
│                                                                 │
│   try {                                                         │
│     ├─ Validate token (check if null/empty/invalid)            │
│     │  ├─ If invalid → Return 401 Unauthorized                │
│     │                                                           │
│     ├─ Extract JWT token (remove "Bearer " prefix)             │
│     │  ├─ jwtToken = "eyJhbGciOiJIUzI1NiIs..."                 │
│     │                                                           │
│     ├─ Validate JWT token:                                      │
│     │  ├─ If invalid → Return 401 Unauthorized                │
│     │                                                           │
│     ├─ Extract userId from token:                               │
│     │  ├─ userId = 5                                           │
│     │                                                           │
│     └─ Call service layer                                       │
│        └─ cartService.getCartItems(userId)                     │
│   }                                                             │
│   catch (Exception e) {                                         │
│     └─ Return error response ← LATER                           │
│   }                                                             │
│ }                                                               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
STEP 8: SERVICE LAYER (BUSINESS LOGIC)
┌─────────────────────────────────────────────────────────────────┐
│ CartService                                                     │
│                                                                 │
│ public List<CartItemDTO> getCartItems(Long userId) {           │
│                                                                 │
│   ├─ Call repository to fetch cart data:                        │
│   │  ├─ cartRepository.findByUserId(userId)                    │
│   │  ├─ Query: SELECT * FROM cart WHERE user_id = 5           │
│   │                                                             │
│   ├─ For each cart item:                                        │
│   │  ├─ Get product details from DB                            │
│   │  ├─ Create CartItemDTO with all info                       │
│   │  └─ Add to response list                                   │
│   │                                                             │
│   ├─ Calculate total:                                           │
│   │  ├─ total = sum(price * quantity for all items)            │
│   │                                                             │
│   └─ Return CartItemDTO list                                   │
│ }                                                               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
STEP 9: REPOSITORY LAYER (DATA ACCESS)
┌─────────────────────────────────────────────────────────────────┐
│ CartRepository (JPA/Hibernate)                                  │
│                                                                 │
│ ├─ Convert method call to SQL:                                  │
│ │  ├─ Method: findByUserId(5)                                  │
│ │  ├─ SQL: SELECT * FROM cart WHERE user_id = 5               │
│ │                                                               │
│ ├─ Execute query via JDBC:                                      │
│ │  ├─ Send to MySQL via JDBC driver                            │
│ │                                                               │
│ └─ Map results to entity objects:                               │
│    ├─ Row 1 → Cart(id=1, userId=5, productId=10, qty=2)       │
│    ├─ Row 2 → Cart(id=2, userId=5, productId=12, qty=1)       │
│    └─ Return List<Cart>                                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
STEP 10: DATABASE QUERY
┌─────────────────────────────────────────────────────────────────┐
│ MySQL Database                                                  │
│                                                                 │
│ Execute: SELECT * FROM cart WHERE user_id = 5                  │
│                                                                 │
│ Results:                                                        │
│ ┌────┬─────────┬────────────┬──────────┐                      │
│ │ id │ user_id │ product_id │ quantity │                      │
│ ├────┼─────────┼────────────┼──────────┤                      │
│ │ 1  │ 5       │ 10         │ 2        │                      │
│ │ 2  │ 5       │ 12         │ 1        │                      │
│ └────┴─────────┴────────────┴──────────┘                      │
│                                                                 │
│ Return rows to Hibernate                                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
STEP 11: BUILD RESPONSE (Service continues)
┌─────────────────────────────────────────────────────────────────┐
│ CartService (continued)                                         │
│                                                                 │
│ For each Cart item, also fetch product details:                │
│                                                                 │
│ ├─ productRepository.findById(10)                              │
│ │  └─ Product: {id: 10, name: "Headphones", price: 79.99}    │
│ │                                                               │
│ ├─ productRepository.findById(12)                              │
│ │  └─ Product: {id: 12, name: "Cable", price: 14.99}          │
│ │                                                               │
│ └─ Build CartItemDTOs:                                          │
│    ├─ Item 1: {cartId: 1, productId: 10, qty: 2,              │
│    │           price: 79.99, name: "Headphones"}              │
│    ├─ Item 2: {cartId: 2, productId: 12, qty: 1,              │
│    │           price: 14.99, name: "Cable"}                   │
│    └─ Total: 79.99*2 + 14.99*1 = 174.97                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
STEP 12: RETURN TO CONTROLLER
┌─────────────────────────────────────────────────────────────────┐
│ CartController (continued)                                      │
│                                                                 │
│ ├─ Receive CartItemDTO list from service                       │
│ │                                                               │
│ ├─ Build response object:                                       │
│ │  {                                                            │
│ │    "items": [                                                 │
│ │      {                                                        │
│ │        "cartId": 1,                                           │
│ │        "productId": 10,                                       │
│ │        "quantity": 2,                                         │
│ │        "price": 79.99,                                        │
│ │        "productName": "Headphones"                            │
│ │      },                                                       │
│ │      {                                                        │
│ │        "cartId": 2,                                           │
│ │        "productId": 12,                                       │
│ │        "quantity": 1,                                         │
│ │        "price": 14.99,                                        │
│ │        "productName": "Cable"                                 │
│ │      }                                                        │
│ │    ],                                                         │
│ │    "total": 174.97                                            │
│ │  }                                                            │
│ │                                                               │
│ └─ Return ResponseEntity.ok(response)                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
STEP 13: SERIALIZE TO JSON
┌─────────────────────────────────────────────────────────────────┐
│ Spring MVC Message Converter                                    │
│                                                                 │
│ ├─ Convert ResponseEntity to HTTP response                     │
│ │                                                               │
│ ├─ Serialize object to JSON:                                    │
│ │  ```json                                                      │
│ │  {                                                            │
│ │    "items": [                                                 │
│ │      {                                                        │
│ │        "cartId": 1,                                           │
│ │        "productId": 10,                                       │
│ │        "quantity": 2,                                         │
│ │        "price": 79.99,                                        │
│ │        "productName": "Headphones"                            │
│ │      },                                                       │
│ │      {                                                        │
│ │        "cartId": 2,                                           │
│ │        "productId": 12,                                       │
│ │        "quantity": 1,                                         │
│ │        "price": 14.99,                                        │
│ │        "productName": "Cable"                                 │
│ │      }                                                        │
│ │    ],                                                         │
│ │    "total": 174.97                                            │
│ │  }                                                            │
│ │  ```                                                          │
│ │                                                               │
│ └─ Set Content-Type: application/json                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
STEP 14: HTTP RESPONSE
┌─────────────────────────────────────────────────────────────────┐
│ HTTP Response                                                   │
│                                                                 │
│ Status: 200 OK                                                  │
│ Headers:                                                        │
│   Content-Type: application/json                               │
│   Access-Control-Allow-Origin: http://localhost:5173           │
│   Access-Control-Allow-Methods: GET, POST, ...                 │
│   ...other headers...                                           │
│                                                                 │
│ Body:                                                           │
│ {                                                               │
│   "items": [                                                    │
│     {                                                           │
│       "cartId": 1,                                              │
│       "productId": 10,                                          │
│       "quantity": 2,                                            │
│       "price": 79.99,                                           │
│       "productName": "Headphones"                               │
│     },                                                          │
│     {                                                           │
│       "cartId": 2,                                              │
│       "productId": 12,                                          │
│       "quantity": 1,                                            │
│       "price": 14.99,                                           │
│       "productName": "Cable"                                    │
│     }                                                           │
│   ],                                                            │
│   "total": 174.97                                               │
│ }                                                               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
STEP 15: BROWSER RECEIVES RESPONSE
┌─────────────────────────────────────────────────────────────────┐
│ Browser/Axios Client                                            │
│                                                                 │
│ ├─ Receive HTTP response (200 OK)                              │
│ │                                                               │
│ ├─ Parse JSON body                                              │
│ │                                                               │
│ ├─ Promise resolves with response data                         │
│ │                                                               │
│ └─ Pass to .then() handler in React component                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
STEP 16: REACT COMPONENT UPDATE
┌─────────────────────────────────────────────────────────────────┐
│ Cart.jsx Component                                              │
│                                                                 │
│ const handleGetCart = async () => {                             │
│   try {                                                         │
│     const data = await cartService.getCartItems();             │
│     // data = { items: [...], total: 174.97 }                  │
│                                                                 │
│     dispatch(setCartItems(data));                              │
│     // Updates Redux state                                     │
│   }                                                             │
│   catch (error) {                                               │
│     setError(error.message);                                   │
│   }                                                             │
│ }                                                               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
STEP 17: REDUX STATE UPDATE
┌─────────────────────────────────────────────────────────────────┐
│ Redux Store (cartSlice.js)                                      │
│                                                                 │
│ ├─ Reducer receives action:                                     │
│ │  ├─ type: "setCartItems"                                     │
│ │  ├─ payload: { items: [...], total: 174.97 }                │
│ │                                                               │
│ ├─ Update state:                                                │
│ │  ├─ state.items = [...]                                      │
│ │  ├─ state.total = 174.97                                     │
│ │                                                               │
│ └─ Notify all subscribers (components listening)                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
STEP 18: UI RE-RENDER
┌─────────────────────────────────────────────────────────────────┐
│ React Component                                                 │
│                                                                 │
│ ├─ Cart.jsx re-renders (because Redux state changed)           │
│ │                                                               │
│ ├─ Read from Redux store:                                       │
│ │  ├─ items = [...]                                            │
│ │  ├─ total = 174.97                                           │
│ │                                                               │
│ ├─ Render JSX:                                                  │
│ │  ├─ Display cart items                                       │
│ │  ├─ Show item count                                          │
│ │  ├─ Show total price                                         │
│ │  └─ Show "Proceed to Checkout" button                        │
│ │                                                               │
│ └─ Browser displays updated UI                                  │
└─────────────────────────────────────────────────────────────────┘

END OF CYCLE ✓
User sees their cart items and total on the screen!
```

---

## Data Flow Diagrams

### Complete Application Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              FRONTEND & BACKEND DATA INTEGRATION                │
└─────────────────────────────────────────────────────────────────┘

SCENARIO: User registers → Logs in → Adds item to cart → Checks out

┌─────────────────────────────────────────────────────────────────┐
│ 1. REGISTRATION                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Frontend (Register.jsx)                                         │
│   User fills form:                                              │
│   ├─ firstName: "John"                                          │
│   ├─ lastName: "Doe"                                            │
│   ├─ email: "john@example.com"                                 │
│   └─ password: "secure123"                                     │
│                                                                 │
│   ↓ Submit → Call authService.createAccount()                  │
│                                                                 │
│ API Call: POST /api/authentication/create-account               │
│   Request Body: { firstName, lastName, email, password }        │
│                                                                 │
│   ↓                                                              │
│                                                                 │
│ Backend (AuthenticationController)                              │
│   authService.createAccount()                                   │
│   ├─ Check if email exists                                      │
│   ├─ Create Account entity                                      │
│   ├─ Save to database                                           │
│   ├─ Generate JWT token (valid 24h)                            │
│   └─ Return: { id, firstName, lastName, email, token }         │
│                                                                 │
│   ↓                                                              │
│                                                                 │
│ Frontend (Register.jsx)                                         │
│   Receive response:                                             │
│   ├─ Save token to localStorage                                │
│   ├─ Dispatch Redux setUser(response)                          │
│   ├─ Redirect to Home page                                     │
│   └─ User is now logged in                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 2. LOGIN                                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Frontend (Login.jsx)                                            │
│   User fills form:                                              │
│   ├─ email: "john@example.com"                                 │
│   └─ password: "secure123"                                     │
│                                                                 │
│   ↓ Submit → Call authService.login()                          │
│                                                                 │
│ API Call: POST /api/authentication/login                        │
│   Request Body: { email, password }                             │
│   Headers: { Content-Type: application/json }                  │
│                                                                 │
│   ↓                                                              │
│                                                                 │
│ Backend (AuthenticationController)                              │
│   authService.login()                                           │
│   ├─ Find account by email                                      │
│   ├─ Validate password                                          │
│   ├─ Generate JWT token                                         │
│   └─ Return: { id, firstName, lastName, email, token }         │
│                                                                 │
│   ↓                                                              │
│                                                                 │
│ Frontend (Login.jsx)                                            │
│   Receive response:                                             │
│   ├─ Save token to localStorage                                │
│   ├─ Dispatch Redux setUser(response)                          │
│   ├─ Redirect to Home page                                     │
│   └─ Header shows "Welcome, John"                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 3. BROWSE & ADD TO CART                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Frontend (Products.jsx)                                         │
│   On component mount:                                           │
│   ├─ Fetch products from API                                   │
│   │                                                             │
│   └─ API: GET /api/products                                    │
│      Response: [                                                │
│        { id: 1, name: "Headphones", price: 79.99, ... },      │
│        { id: 2, name: "Cable", price: 14.99, ... },            │
│        ...                                                      │
│      ]                                                          │
│                                                                 │
│   ├─ Display products in grid                                  │
│   └─ User sees all products                                    │
│                                                                 │
│   User clicks "Add to Cart" on Headphones:                     │
│                                                                 │
│   ├─ handleAddToCart(productId: 1, quantity: 1)                │
│   │                                                             │
│   └─ API: POST /api/cart                                       │
│      Headers: Authorization: Bearer {token}                    │
│      Request Body: { productId: 1, quantity: 1 }               │
│                                                                 │
│      ↓                                                           │
│                                                                 │
│ Backend (CartController)                                        │
│   ├─ Extract JWT token & get userId                            │
│   ├─ Call cartService.addToCart(userId, request)               │
│   │                                                             │
│   ├─ Check if product exists in cart                           │
│   │  ├─ If yes: Update quantity                                │
│   │  └─ If no: Create new cart record                          │
│   │                                                             │
│   ├─ Save to database                                           │
│   └─ Return: { cartId, productId, quantity, price, ... }       │
│                                                                 │
│      ↓                                                           │
│                                                                 │
│ Frontend (Products.jsx)                                         │
│   Receive response:                                             │
│   ├─ Dispatch Redux addToCart(item)                            │
│   ├─ Show "Added to cart" toast message                        │
│   └─ Increment cart counter in header                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 4. VIEW CART                                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Frontend (Cart.jsx)                                             │
│   User navigates to /cart:                                      │
│                                                                 │
│   ├─ API: GET /api/cart                                        │
│   │  Headers: Authorization: Bearer {token}                    │
│   │                                                             │
│   │  ↓                                                           │
│   │                                                             │
│   │ Backend (CartController)                                   │
│   │   ├─ Extract userId from token                             │
│   │   ├─ cartService.getCartItems(userId)                      │
│   │   ├─ Fetch from database                                   │
│   │   └─ Return array of CartItemDTOs with product details     │
│   │                                                             │
│   │  ↓                                                           │
│   │                                                             │
│   ├─ Receive: [                                                 │
│   │   {                                                        │
│   │     cartId: 1,                                             │
│   │     productId: 1,                                          │
│   │     quantity: 1,                                           │
│   │     price: 79.99,                                          │
│   │     productName: "Headphones"                              │
│   │   }                                                        │
│   │ ]                                                          │
│   │                                                             │
│   ├─ Dispatch Redux setCartItems(data)                         │
│   ├─ Re-render cart UI                                         │
│   └─ Display items with total: $79.99                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 5. CHECKOUT & PLACE ORDER                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Frontend (Checkout.jsx)                                         │
│   User fills checkout form:                                     │
│   ├─ deliveryAddress: "123 Main St"                            │
│   ├─ cardNumber: "4532123456789010"                            │
│   ├─ cardHolderName: "John Doe"                                │
│   ├─ expiryDate: "12/25"                                       │
│   └─ cvv: "123"                                                │
│                                                                 │
│   ├─ Get tax rate: API GET /api/order/tax-on-product/US        │
│   │  Response: { country: "US", taxRate: 0.08, taxPercentage:  │
│   │             8.0 }                                          │
│   │                                                             │
│   ├─ Calculate total:                                           │
│   │  ├─ Subtotal: $79.99                                       │
│   │  ├─ Tax (8%): $6.40                                        │
│   │  └─ Total: $86.39                                          │
│   │                                                             │
│   └─ User clicks "Place Order"                                 │
│      │                                                          │
│      └─ API: POST /api/order                                   │
│         Headers: Authorization: Bearer {token}                 │
│         Request Body: {                                        │
│           items: [{ productId: 1, quantity: 1 }],              │
│           deliveryAddress: "123 Main St",                      │
│           cardNumber: "4532123456789010",                      │
│           cardHolderName: "John Doe",                          │
│           expiryDate: "12/25",                                 │
│           cvv: "123"                                           │
│         }                                                       │
│                                                                 │
│         ↓                                                        │
│                                                                 │
│ Backend (OrderController)                                       │
│   ├─ Extract userId from token                                 │
│   ├─ orderService.placeOrder(userId, request)                  │
│   │                                                             │
│   ├─ Validate cart items                                        │
│   │  └─ Fetch from database & verify quantities                │
│   │                                                             │
│   ├─ Create Order record                                        │
│   │  ├─ Calculate totalPrice with tax                          │
│   │  ├─ Set orderDate = now()                                  │
│   │  └─ Store last 4 digits of card                            │
│   │                                                             │
│   ├─ Create OrderItem records (for each item in cart)           │
│   │  ├─ Link to Order                                          │
│   │  └─ Store product snapshot (price, qty)                    │
│   │                                                             │
│   ├─ Clear cart (cartRepository.deleteByUserId(userId))        │
│   │                                                             │
│   └─ Return: {                                                  │
│        id: 1,                                                   │
│        userId: 5,                                              │
│        totalPrice: 86.39,                                      │
│        orderDate: "2025-11-23T16:20:00",                       │
│        deliveryAddress: "123 Main St",                         │
│        cardLastFour: "9010",                                   │
│        message: "Order placed successfully"                    │
│      }                                                          │
│                                                                 │
│      ↓                                                           │
│                                                                 │
│ Frontend (Checkout.jsx)                                         │
│   Receive response:                                             │
│   ├─ Show success message                                       │
│   ├─ Dispatch Redux clearCart()                                │
│   ├─ Redirect to Orders page                                   │
│   └─ User sees their new order in history                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Interaction

### State Flow During Order Placement

```
┌─────────────────────────────────────────────────────────────┐
│           REDUX STATE CHANGES DURING ORDER FLOW             │
└─────────────────────────────────────────────────────────────┘

INITIAL STATE:
├─ auth: { user: {id: 5, email: "john@example.com"}, isLoggedIn: true }
├─ products: { items: [...], loading: false }
└─ cart: { items: [{cartId: 1, productId: 1, qty: 1, price: 79.99}], total: 79.99 }

       ↓ User navigates to Checkout

CHECKOUT COMPONENT MOUNTED:
├─ auth: (no change)
├─ products: (no change)
└─ cart: (no change)

       ↓ User fills form and clicks "Place Order"

BEFORE API CALL:
├─ auth: (no change)
├─ products: (no change)
└─ cart: { items: [...], total: 79.99, loading: true }

       ↓ API call in progress

API RESPONSE RECEIVED:
├─ auth: (no change)
├─ products: (no change)
└─ cart: { items: [], total: 0, loading: false }
         (cart cleared after successful order)

       ↓ Redirect to Orders page

ORDERS PAGE LOADED:
├─ API fetch orders
│  └─ Response: [{ id: 1, totalPrice: 86.39, items: [...] }]
│
└─ Display order in UI

FINAL STATE:
├─ auth: { user: {id: 5, email: "john@example.com"}, isLoggedIn: true }
├─ products: { items: [...], loading: false }
└─ cart: { items: [], total: 0, loading: false } ← Cart cleared
```

---

## Authentication Flow

### JWT Token Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│              JWT TOKEN LIFECYCLE                        │
└─────────────────────────────────────────────────────────┘

GENERATION (Login/Register):
├─ User submits credentials
├─ Backend validates
├─ Backend generates token:
│  ├─ Header: { alg: "HS256", typ: "JWT" }
│  ├─ Payload: { userId: 5, email: "john@example.com", iat: 1700755200, exp: 1700841600 }
│  │            (iat = issued at, exp = expires at)
│  ├─ Signature: HMACSHA256(header + payload, secret_key)
│  └─ Full token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
└─ Send to frontend

STORAGE (Frontend):
├─ Receive token
├─ Store in localStorage (key: "token")
├─ Store in Redux auth.user.token
└─ Token persists across browser refresh

USAGE (For authenticated requests):
├─ Before each API call:
│  ├─ Get token from localStorage
│  ├─ Add to request header: Authorization: Bearer {token}
│  └─ Send request
│
├─ Backend receives request:
│  ├─ Extract token from header
│  ├─ Extract signature from token
│  ├─ Verify signature using secret key
│  ├─ Decode payload if valid
│  ├─ Check expiration time
│  ├─ If valid: Extract userId and attach to request
│  └─ If invalid: Return 401 Unauthorized
│
└─ Process continues with authenticated request

EXPIRATION (After 24 hours):
├─ User makes API call
├─ Backend checks token expiration
├─ Token.exp < Current timestamp
├─ Backend returns 401 Unauthorized
├─ Frontend catches error
├─ Redirect to login page
└─ User must login again

LOGOUT:
├─ User clicks "Logout"
├─ Frontend:
│  ├─ Remove token from localStorage
│  ├─ Clear Redux auth state
│  ├─ Clear cart state
│  └─ Redirect to home/login
└─ Token becomes invalid on next API call
```

---

## Order Processing Flow

### Complete Order Lifecycle

```
┌──────────────────────────────────────────────────────────┐
│            ORDER PROCESSING LIFECYCLE                    │
└──────────────────────────────────────────────────────────┘

STEP 1: USER ADDS ITEMS TO CART
├─ Items stored in database (cart table)
├─ Items also in Redux state for UI
└─ Cart ready for checkout

STEP 2: USER PROCEEDS TO CHECKOUT
├─ Navigates to /checkout
├─ Checkout component loads
├─ Displays current cart items
├─ Get tax rate for country (API call)
├─ Calculate total with tax
└─ Present payment form

STEP 3: USER SUBMITS ORDER
├─ Fill delivery address
├─ Fill payment details (card number, name, expiry, CVV)
├─ Click "Place Order"
├─ Frontend validates:
│  ├─ All fields required
│  ├─ Card number format valid
│  └─ Amount > 0
└─ Send to backend

STEP 4: BACKEND PROCESSING
├─ Receive order request
├─ Extract userId from JWT token
│
├─ Validate cart items:
│  ├─ Fetch all items from cart table
│  ├─ Check each item exists in products
│  └─ Verify quantities available
│
├─ Calculate order total:
│  ├─ Sum: price × quantity for each item
│  ├─ Get tax rate from orderService
│  ├─ Calculate tax amount
│  ├─ Total = subtotal + tax
│  └─ Store in order
│
├─ Create Order record:
│  ├─ INSERT into orders table:
│  │  ├─ user_id: 5
│  │  ├─ total_price: 86.39
│  │  ├─ order_date: NOW()
│  │  ├─ delivery_address: "123 Main St"
│  │  └─ card_last_four: "9010"
│  └─ Get generated order_id = 42
│
├─ Create OrderItem records (for each cart item):
│  ├─ INSERT into order_items for item 1:
│  │  ├─ order_id: 42
│  │  ├─ product_id: 1
│  │  ├─ quantity: 1
│  │  ├─ price: 79.99
│  │  └─ (Store product snapshot in case price changes later)
│  └─ Repeat for all items
│
├─ Clear shopping cart:
│  ├─ DELETE from cart WHERE user_id = 5
│  └─ Cart now empty
│
└─ Return success response with order details

STEP 5: FRONTEND RECEIVES ORDER CONFIRMATION
├─ HTTP 201 (Created)
├─ Response contains:
│  ├─ order_id: 42
│  ├─ total_price: 86.39
│  ├─ order_date: "2025-11-23T16:20:00"
│  └─ message: "Order placed successfully"
│
├─ Clear Redux cart
├─ Show success notification
└─ Redirect to /orders page

STEP 6: USER VIEWS ORDER HISTORY
├─ Navigate to /orders
├─ Frontend API: GET /api/order/ordered-items
├─ Backend:
│  ├─ Extract userId from token
│  ├─ Query orders table: SELECT * FROM orders WHERE user_id = 5
│  ├─ For each order, fetch order_items
│  ├─ For each order_item, get product details
│  └─ Return complete order history
│
├─ Frontend receives order list
├─ Display orders with:
│  ├─ Order ID
│  ├─ Order date
│  ├─ Items in order
│  ├─ Total amount
│  └─ Delivery address

DATABASE STATE AFTER ORDER:

orders table:
┌────┬─────────┬─────────────┬───────────────────────┬────────────────────────┬─────────────────┐
│ id │ user_id │ total_price │ order_date            │ delivery_address       │ card_last_four  │
├────┼─────────┼─────────────┼───────────────────────┼────────────────────────┼─────────────────┤
│ 42 │ 5       │ 86.39       │ 2025-11-23 16:20:00   │ 123 Main St            │ 9010            │
└────┴─────────┴─────────────┴───────────────────────┴────────────────────────┴─────────────────┘

order_items table:
┌────┬──────────┬────────────┬──────────┬────────┐
│ id │ order_id │ product_id │ quantity │ price  │
├────┼──────────┼────────────┼──────────┼────────┤
│ 1  │ 42       │ 1          │ 1        │ 79.99  │
└────┴──────────┴────────────┴──────────┴────────┘

cart table (now empty for user 5):
(All cart items for user 5 have been deleted)
```

---

## Development Workflow

### Git & Version Control Workflow

```
┌────────────────────────────────────────────┐
│    TYPICAL DEVELOPMENT WORKFLOW             │
└────────────────────────────────────────────┘

1. Start work on feature:
   ├─ git checkout -b feature/add-search
   └─ (Create new branch for feature)

2. Make code changes:
   ├─ Modify ProductController.java
   ├─ Update ProductService.java
   ├─ Add ProductRepository query
   └─ Test locally

3. Stage changes:
   ├─ git add src/main/java/...
   └─ (Mark files to commit)

4. Commit changes:
   ├─ git commit -m "Add product search functionality"
   └─ (Save changes with message)

5. Push to remote:
   ├─ git push origin feature/add-search
   └─ (Upload to GitHub/GitLab)

6. Create Pull Request:
   ├─ Request code review
   └─ Wait for approval

7. Merge to main:
   ├─ git checkout main
   ├─ git pull origin main
   ├─ git merge feature/add-search
   └─ Push to production

8. Deploy:
   ├─ Build: ./gradlew build
   ├─ Test: npm run test
   ├─ Deploy to server
   └─ Monitor
```

---

## Deployment Architecture

### Production Deployment

```
┌─────────────────────────────────────────────────────┐
│          PRODUCTION DEPLOYMENT SETUP                │
└─────────────────────────────────────────────────────┘

FRONTEND DEPLOYMENT:
├─ Build production bundle:
│  └─ npm run build
│     ├─ Creates optimized build/ folder
│     ├─ Minifies JavaScript
│     ├─ Optimizes CSS
│     └─ Generates index.html
│
├─ Deploy to static host:
│  ├─ Option 1: Vercel (Recommended for React)
│  ├─ Option 2: Netlify
│  ├─ Option 3: AWS S3 + CloudFront
│  └─ Option 4: GitHub Pages
│
├─ Update API base URL:
│  └─ Change from http://localhost:8080
│      to https://api.example.com
│
└─ DNS Configuration:
   └─ app.example.com → Frontend CDN
      api.example.com → Backend server

BACKEND DEPLOYMENT:
├─ Build JAR file:
│  └─ ./gradlew build
│     └─ Creates EcomerceProj-1.0-SNAPSHOT.jar
│
├─ Deploy to server:
│  ├─ Option 1: AWS EC2
│  ├─ Option 2: Heroku
│  ├─ Option 3: DigitalOcean
│  └─ Option 4: On-premises server
│
├─ Server setup:
│  ├─ Install Java 17+
│  ├─ Install MySQL 8.0+
│  ├─ Configure environment variables
│  ├─ Set HTTPS certificate (SSL)
│  └─ Start application:
│     └─ java -jar EcomerceProj-1.0-SNAPSHOT.jar
│
├─ Environment configuration:
│  ├─ spring.datasource.url=jdbc:mysql://db-server:3306/ecomerce_db
│  ├─ spring.datasource.username=prod_user
│  ├─ spring.datasource.password=secure_password
│  ├─ jwt.secret=very_long_random_secret_key
│  └─ logging.level=WARN (Production)

DATABASE DEPLOYMENT:
├─ Managed MySQL hosting:
│  ├─ AWS RDS
│  ├─ Azure Database
│  ├─ Google Cloud SQL
│  └─ DigitalOcean Managed Databases
│
├─ Backup strategy:
│  ├─ Daily backups
│  ├─ 30-day retention
│  └─ Test restore regularly
│
├─ Performance:
│  ├─ Enable query caching
│  ├─ Create indexes on foreign keys
│  ├─ Monitor slow queries
│  └─ Scale as needed

MONITORING & LOGGING:
├─ Application logs:
│  ├─ Collect to centralized logging (ELK, Datadog)
│  ├─ Monitor errors and warnings
│  └─ Alert on critical issues
│
├─ Performance monitoring:
│  ├─ New Relic / Datadog
│  ├─ Monitor CPU, memory, disk
│  ├─ Track API response times
│  └─ Monitor database performance
│
└─ Uptime monitoring:
   ├─ Pingdom / Uptime Robot
   ├─ Check endpoint every 5 minutes
   └─ Alert if down
```

---

This comprehensive guide covers all aspects of the e-commerce application architecture!

