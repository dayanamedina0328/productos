package com.pos.backend.application.dto.request;

import com.pos.backend.domain.model.enums.CustomerType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record CreateCustomerRequest(
    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name cannot exceed 255 characters")
    String name,

    @NotBlank(message = "NIT is required")
    @Size(max = 50, message = "NIT cannot exceed 50 characters")
    String nit,

    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email cannot exceed 255 characters")
    String email,

    @Size(max = 50, message = "Phone cannot exceed 50 characters")
    String phone,

    String address,

    CustomerType customerType,

    @DecimalMin(value = "0.00", message = "Credit limit cannot be negative")
    @DecimalMax(value = "999999999.99", message = "Credit limit cannot exceed 999,999,999.99")
    @Digits(integer = 9, fraction = 2, message = "Credit limit must have at most 2 decimal places")
    BigDecimal creditLimit
) {}
