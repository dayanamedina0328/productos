package com.pos.backend.application.dto.response;

import com.pos.backend.domain.model.enums.CustomerType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CustomerResponse(
    String id,
    String name,
    String nit,
    String email,
    String phone,
    String address,
    CustomerType customerType,
    BigDecimal creditLimit,
    boolean active,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
