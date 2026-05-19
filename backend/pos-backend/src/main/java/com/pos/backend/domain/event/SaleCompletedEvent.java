package com.pos.backend.domain.event;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SaleCompletedEvent(
    String saleId,
    String invoiceNumber,
    BigDecimal total,
    LocalDateTime occurredAt
) implements DomainEvent {

    public static SaleCompletedEvent of(String saleId, String invoiceNumber, BigDecimal total) {
        return new SaleCompletedEvent(saleId, invoiceNumber, total, LocalDateTime.now());
    }
}
