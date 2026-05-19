package com.pos.backend.application.service;

import com.pos.backend.application.dto.response.ProductResponse;
import com.pos.backend.domain.model.Product;
import org.springframework.stereotype.Component;

/**
 * Mapper de dominio → DTO para productos.
 */
@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product, String categoryName) {
        return new ProductResponse(
            product.getId(),
            product.getSku(),
            product.getName(),
            product.getDescription(),
            product.getPrice(),
            product.getCost(),
            product.getStock(),
            product.getMinStock(),
            product.getCategoryId(),
            categoryName,
            product.getImageUrl(),
            product.isActive(),
            product.getLowStock(),
            product.getCreatedAt(),
            product.getUpdatedAt()
        );
    }
}
