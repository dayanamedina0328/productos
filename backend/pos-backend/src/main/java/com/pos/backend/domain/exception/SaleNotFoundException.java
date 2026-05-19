package com.pos.backend.domain.exception;

public class SaleNotFoundException extends DomainException {
    public SaleNotFoundException(String id) {
        super("SALE_NOT_FOUND", "Sale not found with id: " + id);
    }
}
