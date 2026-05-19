package com.pos.backend.domain.exception;

public class InsufficientStockException extends DomainException {
    private final int availableStock;

    public InsufficientStockException(String productId, String productName, int requested, int available) {
        super("INSUFFICIENT_STOCK",
              String.format("Insufficient stock for product '%s' (id: %s). Requested: %d, Available: %d",
                            productName, productId, requested, available));
        this.availableStock = available;
    }

    public int getAvailableStock() {
        return availableStock;
    }
}
