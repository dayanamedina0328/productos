package com.pos.backend.application.port.input.product;

import com.pos.backend.application.dto.request.UpdateProductRequest;
import com.pos.backend.application.dto.response.ProductResponse;

public interface UpdateProductUseCase {
    ProductResponse execute(String id, UpdateProductRequest request);
}
