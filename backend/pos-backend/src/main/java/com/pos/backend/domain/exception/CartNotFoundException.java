package com.pos.backend.domain.exception;

public class CartNotFoundException extends DomainException {
    public CartNotFoundException(String id) {
        super("CART_NOT_FOUND", "Cart not found with id: " + id);
    }
}
