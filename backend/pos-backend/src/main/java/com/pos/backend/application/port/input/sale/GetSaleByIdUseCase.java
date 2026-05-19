package com.pos.backend.application.port.input.sale;

import com.pos.backend.application.dto.response.SaleResponse;

public interface GetSaleByIdUseCase {
    SaleResponse execute(String saleId);
}
