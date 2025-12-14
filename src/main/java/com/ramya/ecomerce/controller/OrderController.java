package com.ramya.ecomerce.controller;

import com.ramya.ecomerce.dto.OrderRequest;
import com.ramya.ecomerce.dto.OrderResponse;
import com.ramya.ecomerce.entity.Order;
import com.ramya.ecomerce.service.OrderService;
import com.ramya.ecomerce.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtService jwtService;

    @PostMapping
    public ResponseEntity<?> placeOrder(
            @RequestHeader(value = "Authorization", required = false) String token,
            @Valid @RequestBody OrderRequest request) {
        try {
            if (token == null || token.isEmpty() || !token.startsWith("Bearer ")) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Invalid or missing token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            String jwtToken = token.substring(7);
            if (!jwtService.validateToken(jwtToken)) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Invalid token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            Long userId = jwtService.getUserIdFromToken(jwtToken);
            OrderResponse response = orderService.placeOrder(userId, request);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage() != null ? e.getMessage() : "An error occurred while placing order");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/ordered-items")
    public ResponseEntity<?> getOrderedItems(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            if (token == null || token.isEmpty() || !token.startsWith("Bearer ")) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Invalid or missing token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            String jwtToken = token.substring(7);
            if (!jwtService.validateToken(jwtToken)) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Invalid token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            Long userId = jwtService.getUserIdFromToken(jwtToken);
            List<Order> orders = orderService.getUserOrders(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("orders", orders);
            response.put("count", orders.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage() != null ? e.getMessage() : "An error occurred");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/tax-on-product/{country}")
    public ResponseEntity<?> getTaxRate(@PathVariable String country) {
        try {
            Double taxRate = orderService.getTaxRate(country);

            Map<String, Object> response = new HashMap<>();
            response.put("country", country);
            response.put("taxRate", taxRate);
            response.put("taxPercentage", taxRate * 100);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage() != null ? e.getMessage() : "An error occurred while fetching tax rate");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}

