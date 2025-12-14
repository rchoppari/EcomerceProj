package com.ramya.ecomerce.controller;

import com.ramya.ecomerce.dto.CartItemDTO;
import com.ramya.ecomerce.dto.CartRequest;
import com.ramya.ecomerce.entity.Cart;
import com.ramya.ecomerce.service.CartService;
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
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private JwtService jwtService;

    @PostMapping
    public ResponseEntity<?> addToCart(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody CartRequest request) {
        try {
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            String jwtToken = token.substring(7);
            if (!jwtService.validateToken(jwtToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            Long userId = jwtService.getUserIdFromToken(jwtToken);
            Cart cart = cartService.addToCart(userId, request);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product added to cart");
            response.put("cartId", cart.getId());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getCartItems(@RequestHeader("Authorization") String token) {
        try {
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            String jwtToken = token.substring(7);
            if (!jwtService.validateToken(jwtToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            Long userId = jwtService.getUserIdFromToken(jwtToken);
            List<CartItemDTO> items = cartService.getCartItems(userId);
            Double total = cartService.getCartTotal(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("items", items);
            response.put("total", total);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<?> removeFromCart(
            @RequestHeader("Authorization") String token,
            @PathVariable Long cartId) {
        try {
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            String jwtToken = token.substring(7);
            if (!jwtService.validateToken(jwtToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            cartService.removeFromCart(cartId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product removed from cart");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

