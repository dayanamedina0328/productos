package com.pos.backend.application.port.input.sale;

import com.pos.backend.application.dto.response.SaleResponse;

public interface CancelSaleUseCase {
    SaleResponse execute(String saleId);
}
