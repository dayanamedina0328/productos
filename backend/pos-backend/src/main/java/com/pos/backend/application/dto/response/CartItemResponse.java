package com.pos.backend.application.dto.response;

import java.math.BigDecimal;

public record CartItemResponse(
    String id,
    String productId,
    String productName,
    String productSku,
    int quantity,
    BigDecimal unitPrice,
    BigDecimal discount,
    BigDecimal subtotal
) {}
