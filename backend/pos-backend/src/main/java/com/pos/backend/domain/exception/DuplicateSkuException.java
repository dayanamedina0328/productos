package com.pos.backend.domain.exception;

public class DuplicateSkuException extends DomainException {
    public DuplicateSkuException(String sku) {
        super("DUPLICATE_SKU", "A product with SKU '" + sku + "' already exists");
    }
}
