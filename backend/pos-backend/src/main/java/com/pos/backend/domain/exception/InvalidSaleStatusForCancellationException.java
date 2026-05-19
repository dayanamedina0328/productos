package com.pos.backend.domain.exception;

import com.pos.backend.domain.model.enums.SaleStatus;

public class InvalidSaleStatusForCancellationException extends DomainException {
    public InvalidSaleStatusForCancellationException(String saleId, SaleStatus currentStatus) {
        super("INVALID_SALE_STATUS_FOR_CANCELLATION",
              String.format("Sale '%s' cannot be cancelled. Current status: %s", saleId, currentStatus));
    }
}
