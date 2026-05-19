package com.pos.backend.infrastructure.persistence.mapper;

import com.pos.backend.domain.model.Product;
import com.pos.backend.infrastructure.persistence.entity.CategoryEntity;
import com.pos.backend.infrastructure.persistence.entity.ProductEntity;
import org.springframework.stereotype.Component;

@Component
public class ProductEntityMapper {

    public Product toDomain(ProductEntity entity) {
        return Product.reconstitute(
            entity.getId(),
            entity.getSku(),
            entity.getName(),
            entity.getDescription(),
            entity.getPrice(),
            entity.getCost(),
            entity.getStock(),
            entity.getMinStock(),
            entity.getCategory().getId(),
            entity.getImageUrl(),
            entity.isActive(),
            entity.getCreatedAt(),
            entity.getUpdatedAt()
        );
    }

    public ProductEntity toEntity(Product domain, CategoryEntity categoryEntity) {
        return ProductEntity.builder()
            .id(domain.getId())
            .sku(domain.getSku())
            .name(domain.getName())
            .description(domain.getDescription())
            .price(domain.getPrice())
            .cost(domain.getCost())
            .stock(domain.getStock())
            .minStock(domain.getMinStock())
            .category(categoryEntity)
            .imageUrl(domain.getImageUrl())
            .active(domain.isActive())
            .lowStock(domain.getLowStock())
            .build();
    }
}
