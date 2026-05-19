package com.pos.backend.domain.exception;

public class CustomerNotFoundException extends DomainException {
    public CustomerNotFoundException(String id) {
        super("CUSTOMER_NOT_FOUND", "Customer not found with id: " + id);
    }
}
