package com.pos.backend.domain.event;

import java.time.LocalDateTime;

public record StockLowEvent(
    String productId,
    String sku,
    String productName,
    int currentStock,
    int minStock,
    LocalDateTime occurredAt
) implements DomainEvent {

    public static StockLowEvent of(String productId, String sku, String productName,
                                   int currentStock, int minStock) {
        return new StockLowEvent(productId, sku, productName, currentStock, minStock, LocalDateTime.now());
    }
}
