package com.pos.backend.application.dto.request;

import com.pos.backend.domain.model.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Map;

public record ProcessSaleRequest(
    @NotBlank(message = "Cart ID is required")
    String cartId,

    String customerId,

    @NotNull(message = "Payment method is required")
    PaymentMethod paymentMethod,

    Map<String, Object> paymentDetails
) {}
