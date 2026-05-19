package com.pos.backend.application.port.input.category;

import com.pos.backend.application.dto.response.CategoryResponse;

public interface GetCategoryByIdUseCase {
    CategoryResponse execute(String id);
}
