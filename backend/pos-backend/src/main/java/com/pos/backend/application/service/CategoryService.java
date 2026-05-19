package com.pos.backend.application.service;

import com.pos.backend.application.dto.request.CreateCategoryRequest;
import com.pos.backend.application.dto.response.CategoryResponse;
import com.pos.backend.application.port.input.category.*;
import com.pos.backend.domain.exception.CategoryHasChildrenException;
import com.pos.backend.domain.exception.CategoryHasProductsException;
import com.pos.backend.domain.exception.CategoryNotFoundException;
import com.pos.backend.domain.model.Category;
import com.pos.backend.domain.port.output.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CategoryService implements GetCategoriesUseCase, GetCategoryByIdUseCase,
                                        CreateCategoryUseCase, DeleteCategoryUseCase {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> execute() {
        return categoryRepository.findAll().stream()
            .map(this::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse execute(String id) {
        return toResponse(categoryRepository.findById(id)
            .orElseThrow(() -> new CategoryNotFoundException(id)));
    }

    @Override
    public CategoryResponse execute(CreateCategoryRequest request) {
        int level = 0;
        if (request.parentId() != null) {
            Category parent = categoryRepository.findById(request.parentId())
                .orElseThrow(() -> new CategoryNotFoundException(request.parentId()));
            level = parent.getLevel() + 1;
        }

        Category category = request.parentId() == null
            ? Category.createRoot(UUID.randomUUID().toString(), request.name(), request.description())
            : Category.createChild(UUID.randomUUID().toString(), request.name(), request.description(),
                                   request.parentId(), level - 1);

        return toResponse(categoryRepository.save(category));
    }

    @Override
    public void execute(String id) {
        categoryRepository.findById(id)
            .orElseThrow(() -> new CategoryNotFoundException(id));

        if (categoryRepository.hasChildren(id)) {
            throw new CategoryHasChildrenException(id);
        }
        if (categoryRepository.hasProducts(id)) {
            throw new CategoryHasProductsException(id);
        }

        categoryRepository.deleteById(id);
    }

    private CategoryResponse toResponse(Category category) {
        List<CategoryResponse> children = categoryRepository.findByParentId(category.getId())
            .stream().map(this::toResponse).toList();

        return new CategoryResponse(
            category.getId(),
            category.getName(),
            category.getDescription(),
            category.getParentId(),
            category.getLevel(),
            category.isActive(),
            children,
            category.getCreatedAt(),
            category.getUpdatedAt()
        );
    }
}
