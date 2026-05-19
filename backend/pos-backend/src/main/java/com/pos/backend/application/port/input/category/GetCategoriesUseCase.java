package com.pos.backend.application.port.input.category;

import com.pos.backend.application.dto.response.CategoryResponse;

import java.util.List;

public interface GetCategoriesUseCase {
    List<CategoryResponse> getCategories();
}
