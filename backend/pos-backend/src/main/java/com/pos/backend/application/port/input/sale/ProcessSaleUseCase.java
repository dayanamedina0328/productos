package com.pos.backend.application.port.input.sale;

import com.pos.backend.application.dto.request.ProcessSaleRequest;
import com.pos.backend.application.dto.response.SaleResponse;

public interface ProcessSaleUseCase {
    SaleResponse execute(ProcessSaleRequest request, String createdBy);
}
