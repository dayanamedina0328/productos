package com.pos.backend.infrastructure.persistence.mapper;

import com.pos.backend.domain.model.Category;
import com.pos.backend.infrastructure.persistence.entity.CategoryEntity;
import org.springframework.stereotype.Component;

@Component
public class CategoryEntityMapper {

    public Category toDomain(CategoryEntity entity) {
        return Category.reconstitute(
            entity.getId(),
            entity.getName(),
            entity.getDescription(),
            entity.getParent() != null ? entity.getParent().getId() : null,
            entity.getLevel(),
            entity.isActive(),
            entity.getCreatedAt(),
            entity.getUpdatedAt()
        );
    }

    public CategoryEntity toEntity(Category domain) {
        return CategoryEntity.builder()
            .id(domain.getId())
            .name(domain.getName())
            .description(domain.getDescription())
            .level(domain.getLevel())
            .active(domain.isActive())
            .build();
    }
}
