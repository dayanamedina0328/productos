package com.pos.backend.application.port.input.product;

import com.pos.backend.application.dto.response.PagedResponse;
import com.pos.backend.application.dto.response.ProductResponse;

public interface GetProductsUseCase {
    PagedResponse<ProductResponse> execute(String categoryId, String name, Boolean active,
                                           Boolean lowStock, int page, int pageSize);
}
