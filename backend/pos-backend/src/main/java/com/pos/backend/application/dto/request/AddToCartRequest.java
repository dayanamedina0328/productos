package com.pos.backend.application.dto.request;

import jakarta.validation.constraints.*;

public record AddToCartRequest(
    @NotBlank(message = "Product ID is required")
    String productId,

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 999999, message = "Quantity cannot exceed 999,999")
    Integer quantity
) {}
