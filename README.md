# E-Commerce Web Application

A full-stack e-commerce web application that allows users to browse, search, filter, and purchase products. Built with Spring Boot (Java 21) backend, React.js frontend, and MySQL database.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 📝 Project Overview

This is a full-stack Mini E-Commerce Web Application designed to provide a seamless shopping experience. Users can:
- Browse and search for products
- Filter and sort products by price, ratings, and categories
- Create accounts and log in securely
- Add/remove items from the shopping cart
- Place orders with delivery address and payment details
- View their order history
- Reorder products from their purchase history

The application is divided into three main components:
1. **Frontend**: React.js with Redux for state management and Tailwind CSS for styling
2. **Backend**: Spring Boot REST APIs with JWT authentication
3. **Database**: MySQL with comprehensive schema design

---

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 21
- **Database**: MySQL 8.2.0
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Spring Security
- **Validation**: Jakarta Validation API
- **Build Tool**: Gradle
- **ORM**: JPA (Hibernate)

### Frontend
- **Library**: React.js 18.2.0
- **State Management**: Redux Toolkit, React-Redux
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 3.3.6
- **HTTP Client**: Axios 1.6.2
- **Routing**: React Router DOM 6.20.0

### Database
- **DBMS**: MySQL 8.2.0
- **Tables**: Accounts, Products, Cart, Orders, Order Items
- **Features**: Foreign Keys, Indexes, Unique Constraints

---

## ✨ Features

### 1. User Management
- ✅ User registration with validation
- ✅ User login with JWT authentication
- ✅ Secure password handling
- ✅ Email uniqueness validation

### 2. Product Catalog
- ✅ View all products (minimum 10 sample products)
- ✅ Search products by name or category (case-insensitive)
- ✅ Filter by price range (min-max)
- ✅ Filter by rating range (min-max)
- ✅ Sort by price (low to high / high to low)
- ✅ Sort by ratings
- ✅ Detailed product information (name, image, price, rating)

### 3. Shopping Cart
- ✅ Add products to cart
- ✅ View cart items with quantities
- ✅ Remove items from cart
- ✅ Calculate total cart value
- ✅ Cart persistence per user

### 4. Order Management
- ✅ Place orders with delivery address
- ✅ Add payment card details
- ✅ Calculate GST (8% tax) on orders
- ✅ Order confirmation with delivery date (current date + 7 days)
- ✅ View order history
- ✅ Reorder functionality

### 5. Tax Calculation
- ✅ Country-based tax rates
- ✅ Dynamic GST calculation (8% for India/default)
- ✅ Tax rate API

---

## 📁 Project Structure

```
EcomerceProj/
├── backend (Spring Boot)
│   ├── src/main/java/com/ramya/ecomerce/
│   │   ├── config/              # Configuration classes
│   │   │   ├── AppConfig.java
│   │   │   └── SecurityConfig.java
│   │   ├── controller/          # REST API Controllers
│   │   │   ├── AuthenticationController.java
│   │   │   ├── ProductController.java
│   │   │   ├── CartController.java
│   │   │   └── OrderController.java
│   │   ├── entity/              # JPA Entities
│   │   │   ├── Account.java
│   │   │   ├── Product.java
│   │   │   ├── Cart.java
│   │   │   ├── Order.java
│   │   │   └── OrderItem.java
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── service/             # Business Logic
│   │   │   ├── AuthenticationService.java
│   │   │   ├── ProductService.java
│   │   │   ├── CartService.java
│   │   │   ├── OrderService.java
│   │   │   └── JwtService.java
│   │   ├── repository/          # JPA Repositories
│   │   ├── util/                # Utility Classes
│   │   └── EcommerceApplication.java
│   ├── src/main/resources/
│   │   ├── application.yml      # Configuration
│   │   └── logback-spring.xml   # Logging configuration
│   └── build.gradle.kts         # Gradle build file
│
├── frontend (React.js)
│   ├── src/
│   │   ├── components/          # React Components
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── Header.jsx
│   │   ├── redux/               # Redux Store & Slices
│   │   │   ├── store.js
│   │   │   ├── authSlice.js
│   │   │   ├── productSlice.js
│   │   │   └── cartSlice.js
│   │   ├── services/            # API Services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── cartService.js
│   │   │   └── orderService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── Database
│   └── mysql-setup-script.sql   # Database initialization script
│
├── Documentation
│   ├── README.md                # This file
│   ├── TECHNICAL_OVERVIEW.md
│   ├── ARCHITECTURE_DETAILED.md
│   └── VISUAL_GUIDE_AND_REFERENCE.md
│
└── Configuration
    ├── build.gradle.kts
    ├── settings.gradle.kts
    └── application.yml
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Java 21** or higher
  - Download from: https://www.oracle.com/java/technologies/downloads/#java21
  
- **Node.js** (v16 or higher) and npm
  - Download from: https://nodejs.org/
  
- **MySQL 8.0** or higher
  - Download from: https://www.mysql.com/downloads/
  
- **Git** (optional, for version control)
  - Download from: https://git-scm.com/

### Verification Commands
```bash
# Check Java version
java -version

# Check Node.js and npm version
node --version
npm --version

# Check MySQL version
mysql --version
```

---

## 🚀 Setup Instructions

### Step 1: Clone/Extract the Project
```bash
# If using git
git clone <repository-url>
cd EcomerceProj

# Or extract the provided zip file
```

### Step 2: Database Setup

#### Option A: Using MySQL Command Line
```bash
# Open MySQL Command Prompt or MySQL Shell
mysql -u root -p

# Run the setup script
source mysql-setup-script.sql;

# Verify database creation
SHOW DATABASES;
USE ecommerce_db;
SHOW TABLES;
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your MySQL server
3. File → Open SQL Script → Select `mysql-setup-script.sql`
4. Execute the script
5. Verify tables are created

### Step 3: Update Database Configuration

Edit `src/main/resources/application.yml` and update the MySQL credentials:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ecommerce_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root              # Change to your MySQL username
    password: sysassysdba       # Change to your MySQL password
    driver-class-name: com.mysql.cj.jdbc.Driver
```

### Step 4: Backend Setup

```bash
# Navigate to the project root directory
cd C:\Users\user\IdeaProjects\EcomerceProj

# Build the project (this will download dependencies)
./gradlew build

# Or on Windows, use:
gradlew.bat build
```

### Step 5: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Verify installation
npm list
```

---

## ▶️ Running the Application

### Method 1: Run Backend and Frontend Together

#### Terminal 1 - Backend (Spring Boot)
```bash
# From project root directory
./gradlew bootRun

# Or on Windows:
gradlew.bat bootRun

# The backend will start at http://localhost:8080
# You should see: "Tomcat started on port(s): 8080"
```

#### Terminal 2 - Frontend (React.js)
```bash
# From frontend directory
cd frontend

npm run dev

# The frontend will start at http://localhost:5173
# You should see: "➜  Local:   http://localhost:5173/"
```

### Method 2: Run using IDEs

#### Spring Boot (IntelliJ IDEA / Eclipse)
1. Open `EcommerceApplication.java`
2. Click the green play button or press `Shift + F10` (IntelliJ) / `Ctrl + F11` (Eclipse)
3. Backend runs at `http://localhost:8080`

#### React Frontend (VS Code)
1. Open the `frontend` folder in VS Code
2. Open Terminal: `Ctrl + ~`
3. Run: `npm run dev`
4. Click on the local link shown in the terminal

---

## 🌐 Accessing the Application

Once both backend and frontend are running:

1. **Open your browser** and navigate to:
   ```
   http://localhost:5173
   ```

2. **Expected Application Flow**:
   - Home page with all products
   - Search bar for product search
   - Filter and sort options
   - Shopping cart functionality
   - Login/Register pages
   - Checkout and order placement
   - Order history

---

## 📡 API Endpoints

### Authentication APIs
| Method | Endpoint | Description | Headers |
|--------|----------|-------------|---------|
| POST | `/api/authentication/login` | User login | - |
| POST | `/api/authentication/create-account` | Create new account | - |

### Product APIs
| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| GET | `/api/products` | Get all products | `search`, `minPrice`, `maxPrice`, `minRating`, `maxRating`, `sortBy`, `order` |
| GET | `/api/products/{id}` | Get single product by ID | - |

### Cart APIs
| Method | Endpoint | Description | Headers |
|--------|----------|-------------|---------|
| POST | `/api/cart` | Add product to cart | `Authorization: Bearer <token>` |
| GET | `/api/cart` | Get cart items | `Authorization: Bearer <token>` |
| DELETE | `/api/cart/{cartId}` | Remove product from cart | `Authorization: Bearer <token>` |

### Order APIs
| Method | Endpoint | Description | Headers |
|--------|----------|-------------|---------|
| POST | `/api/order` | Place order | `Authorization: Bearer <token>` |
| GET | `/api/order/ordered-items` | Get user's orders | `Authorization: Bearer <token>` |
| GET | `/api/order/tax-on-product/{country}` | Get tax rate by country | - |

### Example Requests

#### Login
```bash
curl -X POST http://localhost:8080/api/authentication/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Get All Products
```bash
curl http://localhost:8080/api/products
```

#### Add to Cart
```bash
curl -X POST http://localhost:8080/api/cart \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

---

## 🗄 Database Schema

### Tables Overview

#### accounts
```
id (BIGINT) - Primary Key
first_name (VARCHAR)
last_name (VARCHAR)
email (VARCHAR) - UNIQUE
password (VARCHAR)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

#### products
```
id (BIGINT) - Primary Key
name (VARCHAR)
price (DOUBLE)
rating (DOUBLE)
category (VARCHAR)
description (VARCHAR)
image_url (VARCHAR)
stock (INT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

#### cart
```
id (BIGINT) - Primary Key
user_id (BIGINT) - Foreign Key (accounts)
product_id (BIGINT) - Foreign Key (products)
quantity (INT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
UNIQUE(user_id, product_id)
```

#### orders
```
id (BIGINT) - Primary Key
user_id (BIGINT) - Foreign Key (accounts)
total_price (DOUBLE)
order_date (TIMESTAMP)
delivery_address (VARCHAR)
card_last_four (VARCHAR)
status (VARCHAR)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

#### order_items
```
id (BIGINT) - Primary Key
order_id (BIGINT) - Foreign Key (orders)
product_id (BIGINT) - Foreign Key (products)
quantity (INT)
unit_price (DOUBLE)
created_at (TIMESTAMP)
```

---

## 🔐 Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Password Encryption**: Passwords encrypted using BCrypt
3. **CORS Configuration**: Configured to allow frontend requests
4. **Spring Security**: Integrated for API protection
5. **Email Validation**: Frontend and backend validation
6. **Token Expiration**: JWT tokens expire after 24 hours (configurable)

---

## ⚙️ Configuration Files

### application.yml
```yaml
server:
  port: 8080                      # Backend port

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ecommerce_db
    username: root
    password: sysassysdba
  
  jpa:
    hibernate:
      ddl-auto: validate          # Use 'validate' for production

jwt:
  secret: your-secret-key         # Change in production
  expiration: 86400000            # 24 hours in milliseconds
```

### Environment Variables (Optional)
Create a `.env` file in the `frontend` directory:
```
VITE_API_URL=http://localhost:8080/api
```

---

## 🐛 Troubleshooting

### Issue: MySQL Connection Error
**Error**: `com.mysql.cj.jdbc.exceptions.CommunicationsException: Communications link failure`

**Solution**:
1. Verify MySQL is running
2. Check username and password in `application.yml`
3. Ensure database `ecommerce_db` exists
4. Check MySQL port (default: 3306)

### Issue: Port 8080 Already in Use
**Solution**:
```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or change port in application.yml
server:
  port: 8081
```

### Issue: Port 5173 Already in Use
**Solution**:
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or specify a different port
npm run dev -- --port 5174
```

### Issue: `npm` Command Not Found
**Solution**:
- Ensure Node.js is installed
- Add Node.js to system PATH
- Restart terminal/IDE after installation
- Verify: `node --version`

### Issue: `vite` is not recognized as an internal or external command
**Solution**:
```bash
cd frontend
npm install
npm run dev
```

### Issue: CORS Error in Browser Console
**Solution**:
1. Verify backend is running on port 8080
2. Check `SecurityConfig.java` for CORS configuration
3. Ensure API URL in frontend matches backend

### Issue: Build Failures
**Solution**:
```bash
# Clean previous builds
./gradlew clean

# Build with verbose output
./gradlew build --info

# For frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📖 Additional Documentation

- **TECHNICAL_OVERVIEW.md** - Detailed technical flow and architecture
- **ARCHITECTURE_DETAILED.md** - System architecture and design patterns
- **VISUAL_GUIDE_AND_REFERENCE.md** - UI/UX guide and screenshots

---

## 🔄 Sample Workflow

### User Journey

1. **Sign Up**
   - Navigate to Register page
   - Enter First Name, Last Name, Email, Password
   - Click "Create Account"
   - JWT token generated and stored locally

2. **Browse Products**
   - View all products on home page
   - Search by product name
   - Filter by price range and rating
   - Sort by price or ratings

3. **Shopping**
   - Click "Add to Cart" on desired products
   - Navigate to Cart page
   - View total price
   - Remove items if needed

4. **Checkout**
   - Click "Order Now"
   - Enter delivery address
   - Enter card details
   - View total with GST (8%)
   - Click "Buy"

5. **Order Confirmation**
   - See confirmation message with delivery date
   - Cart items cleared
   - Cart updated

6. **View Orders**
   - Navigate to "Orders" page
   - View all previous orders
   - Click "Order Again" to reorder

---

## 📞 Support & Contact

For issues or questions, please:
1. Check the Troubleshooting section
2. Review error logs in console
3. Check backend logs at: `src/main/resources/logback-spring.xml`

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎯 Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications for orders
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Coupon and discount codes
- [ ] Multiple address management
- [ ] Order tracking and shipping updates
- [ ] Mobile app version

---

**Last Updated**: December 14, 2025  
**Version**: 1.0  
**Status**: Production Ready

