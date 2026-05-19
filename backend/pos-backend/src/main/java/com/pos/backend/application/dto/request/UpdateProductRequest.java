package com.pos.backend.application.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record UpdateProductRequest(
    @Size(max = 50, message = "SKU cannot exceed 50 characters")
    String sku,

    @Size(max = 255, message = "Name cannot exceed 255 characters")
    String name,

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    String description,

    @Positive(message = "Price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Price must have at most 2 decimal places")
    BigDecimal price,

    @PositiveOrZero(message = "Cost cannot be negative")
    @Digits(integer = 10, fraction = 2, message = "Cost must have at most 2 decimal places")
    BigDecimal cost,

    @PositiveOrZero(message = "Stock cannot be negative")
    Integer stock,

    @PositiveOrZero(message = "Min stock cannot be negative")
    Integer minStock,

    String categoryId,

    @Size(max = 500, message = "Image URL cannot exceed 500 characters")
    String imageUrl,

    Boolean active
) {}
