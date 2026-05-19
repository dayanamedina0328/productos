package com.pos.backend.application.port.input.category;

import com.pos.backend.application.dto.request.CreateCategoryRequest;
import com.pos.backend.application.dto.response.CategoryResponse;

public interface CreateCategoryUseCase {
    CategoryResponse execute(CreateCategoryRequest request);
}
