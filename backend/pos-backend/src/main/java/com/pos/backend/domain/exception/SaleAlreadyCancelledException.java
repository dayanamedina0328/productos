package com.pos.backend.domain.exception;

public class SaleAlreadyCancelledException extends DomainException {
    public SaleAlreadyCancelledException(String saleId) {
        super("SALE_ALREADY_CANCELLED", "Sale '" + saleId + "' is already cancelled");
    }
}
