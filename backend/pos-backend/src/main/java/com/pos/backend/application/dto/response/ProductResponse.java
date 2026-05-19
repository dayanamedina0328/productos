package com.pos.backend.application.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponse(
    String id,
    String sku,
    String name,
    String description,
    BigDecimal price,
    BigDecimal cost,
    int stock,
    int minStock,
    String categoryId,
    String categoryName,
    String imageUrl,
    boolean active,
    boolean lowStock,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
