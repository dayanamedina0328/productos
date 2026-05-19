package com.pos.backend.application.port.input.product;

import com.pos.backend.application.dto.request.CreateProductRequest;
import com.pos.backend.application.dto.response.ProductResponse;

public interface CreateProductUseCase {
    ProductResponse execute(CreateProductRequest request);
}
