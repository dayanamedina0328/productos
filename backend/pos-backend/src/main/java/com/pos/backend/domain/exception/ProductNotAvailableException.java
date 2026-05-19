package com.pos.backend.domain.exception;

public class ProductNotAvailableException extends DomainException {
    public ProductNotAvailableException(String productId) {
        super("PRODUCT_INACTIVE", "Product '" + productId + "' is not available (inactive or out of stock)");
    }
}
