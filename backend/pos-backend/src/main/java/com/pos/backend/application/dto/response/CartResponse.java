package com.pos.backend.application.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record CartResponse(
    String id,
    String customerId,
    List<CartItemResponse> items,
    BigDecimal subtotal,
    BigDecimal tax,
    BigDecimal total,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
