package com.ramya.ecomerce.service;

import com.ramya.ecomerce.dto.CartItemDTO;
import com.ramya.ecomerce.dto.CartRequest;
import com.ramya.ecomerce.entity.Cart;
import com.ramya.ecomerce.entity.Product;
import com.ramya.ecomerce.repository.CartRepository;
import com.ramya.ecomerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    public Cart addToCart(Long userId, CartRequest request) {
        Optional<Product> productOpt = productRepository.findById(request.getProductId());
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found");
        }

        Optional<Cart> existingCart = cartRepository.findByUserIdAndProductId(userId, request.getProductId());

        if (existingCart.isPresent()) {
            Cart cart = existingCart.get();
            cart.setQuantity(cart.getQuantity() + request.getQuantity());
            return cartRepository.save(cart);
        }

        Cart cart = new Cart();
        cart.setUserId(userId);
        cart.setProductId(request.getProductId());
        cart.setQuantity(request.getQuantity());

        return cartRepository.save(cart);
    }

    public List<CartItemDTO> getCartItems(Long userId) {
        List<Cart> carts = cartRepository.findByUserId(userId);
        List<CartItemDTO> cartItems = new ArrayList<>();

        for (Cart cart : carts) {
            Optional<Product> productOpt = productRepository.findById(cart.getProductId());
            if (productOpt.isPresent()) {
                Product product = productOpt.get();
                CartItemDTO dto = new CartItemDTO(
                    cart.getId(),
                    cart.getProductId(),
                    cart.getQuantity(),
                    product.getPrice(),
                    product.getName()
                );
                cartItems.add(dto);
            }
        }

        return cartItems;
    }

    public void removeFromCart(Long cartId) {
        cartRepository.deleteById(cartId);
    }

    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }

    public Cart findByUserIdAndProductId(Long userId, Long productId) {
        return cartRepository.findByUserIdAndProductId(userId, productId).orElse(null);
    }

    public Double getCartTotal(Long userId) {
        List<CartItemDTO> items = getCartItems(userId);
        return items.stream()
            .mapToDouble(item -> item.getPrice() * item.getQuantity())
            .sum();
    }
}

