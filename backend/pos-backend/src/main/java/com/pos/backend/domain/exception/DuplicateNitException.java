package com.pos.backend.domain.exception;

public class DuplicateNitException extends DomainException {
    public DuplicateNitException(String nit) {
        super("DUPLICATE_NIT", "A customer with NIT '" + nit + "' already exists");
    }
}
