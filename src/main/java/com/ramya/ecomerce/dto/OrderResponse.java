package com.ramya.ecomerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long orderId;
    private List<CartItemDTO> items;
    private Double totalPrice;
    private Double taxAmount;
    private Double grandTotal;
    private LocalDateTime orderDate;
    private LocalDateTime expectedDeliveryDate;
    private String message;
}

