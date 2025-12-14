package com.ramya.ecomerce.service;

import com.ramya.ecomerce.dto.CartItemDTO;
import com.ramya.ecomerce.dto.OrderRequest;
import com.ramya.ecomerce.dto.OrderResponse;
import com.ramya.ecomerce.entity.Order;
import com.ramya.ecomerce.entity.OrderItem;
import com.ramya.ecomerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    public static final double GST_RATE = 0.08; // 8% GST

    public OrderResponse placeOrder(Long userId, OrderRequest request) {
        List<CartItemDTO> items = request.getItems();

        if (items == null || items.isEmpty()) {
            throw new RuntimeException("Cart items are required");
        }

        // Calculate total price
        Double totalPrice = items.stream()
            .mapToDouble(item -> item.getPrice() * item.getQuantity())
            .sum();

        Double taxAmount = totalPrice * GST_RATE;
        Double grandTotal = totalPrice + taxAmount;

        // Create order
        Order order = new Order();
        order.setUserId(userId);
        order.setOrderDate(LocalDateTime.now());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setCardLastFour(request.getCardNumber().substring(request.getCardNumber().length() - 4));
        order.setTotalPrice(totalPrice);

        // Create order items
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItemDTO item : items) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductId(item.getProductId());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setUnitPrice(item.getPrice());
            orderItems.add(orderItem);
        }
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Clear user's cart
        cartService.clearCart(userId);

        // Create response
        OrderResponse response = new OrderResponse();
        response.setOrderId(savedOrder.getId());
        response.setItems(items);
        response.setTotalPrice(totalPrice);
        response.setTaxAmount(taxAmount);
        response.setGrandTotal(grandTotal);
        response.setOrderDate(savedOrder.getOrderDate());
        response.setExpectedDeliveryDate(savedOrder.getOrderDate().plusDays(7));
        response.setMessage("Your order has been placed. Will arrive before " + response.getExpectedDeliveryDate().toLocalDate());

        return response;
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public Double getTaxRate(String country) {
        // For now, return 8% for all countries. Can be extended for different countries
        return GST_RATE;
    }
}

