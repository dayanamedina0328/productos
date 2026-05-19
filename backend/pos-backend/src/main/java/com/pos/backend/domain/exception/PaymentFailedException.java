package com.pos.backend.domain.exception;

public class PaymentFailedException extends DomainException {
    public PaymentFailedException(String reason) {
        super("PAYMENT_FAILED", "Payment processing failed: " + reason);
    }
}
