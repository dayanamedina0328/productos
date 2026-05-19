package com.pos.backend.domain.exception;

public class ProductNotFoundException extends DomainException {
    public ProductNotFoundException(String id) {
        super("PRODUCT_NOT_FOUND", "Product not found with id: " + id);
    }
}
