package com.pos.backend.application.dto.response;

import com.pos.backend.domain.model.enums.PaymentMethod;
import com.pos.backend.domain.model.enums.SaleStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record SaleResponse(
    String id,
    String invoiceNumber,
    String customerId,
    String createdBy,
    List<SaleItemResponse> items,
    BigDecimal subtotal,
    BigDecimal tax,
    BigDecimal discount,
    BigDecimal total,
    PaymentMethod paymentMethod,
    Map<String, Object> paymentDetails,
    SaleStatus status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
