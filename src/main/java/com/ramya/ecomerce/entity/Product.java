package com.ramya.ecomerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Double rating;

    @Column(nullable = false)
    private String category;

    @Column(length = 1000)
    private String description;

    @Column(length = 1000)
    private String imageUrl;

    @Column(nullable = false)
    private Integer stock;
}

