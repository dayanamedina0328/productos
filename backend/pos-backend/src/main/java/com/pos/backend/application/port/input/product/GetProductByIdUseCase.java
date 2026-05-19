package com.pos.backend.application.port.input.product;

import com.pos.backend.application.dto.response.ProductResponse;

public interface GetProductByIdUseCase {
    ProductResponse execute(String id);
}
