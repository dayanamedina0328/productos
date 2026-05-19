package com.pos.backend.application.service;

import com.pos.backend.application.dto.request.UpdateProductRequest;
import com.pos.backend.application.dto.response.ProductResponse;
import com.pos.backend.application.port.input.product.UpdateProductUseCase;
import com.pos.backend.domain.exception.CategoryNotFoundException;
import com.pos.backend.domain.exception.DuplicateSkuException;
import com.pos.backend.domain.exception.ProductNotFoundException;
import com.pos.backend.domain.model.Category;
import com.pos.backend.domain.model.Product;
import com.pos.backend.domain.port.output.CategoryRepository;
import com.pos.backend.domain.port.output.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UpdateProductService implements UpdateProductUseCase {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    public UpdateProductService(ProductRepository productRepository,
                                CategoryRepository categoryRepository,
                                ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productMapper = productMapper;
    }

    @Override
    public ProductResponse execute(String id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ProductNotFoundException(id));

        // Validar SKU único si se está cambiando
        if (request.sku() != null && !request.sku().equals(product.getSku())) {
            if (productRepository.existsBySkuAndIdNot(request.sku(), id)) {
                throw new DuplicateSkuException(request.sku());
            }
        }

        // Validar categoría si se está cambiando
        String categoryName = null;
        if (request.categoryId() != null) {
            Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException(request.categoryId()));
            categoryName = category.getName();
        } else {
            categoryName = categoryRepository.findById(product.getCategoryId())
                .map(Category::getName).orElse("");
        }

        // Actualizar entidad de dominio
        product.update(
            request.sku(),
            request.name(),
            request.description(),
            request.price(),
            request.cost(),
            request.stock() != null ? request.stock() : -1,
            request.minStock() != null ? request.minStock() : -1,
            request.categoryId(),
            request.imageUrl()
        );

        if (request.active() != null) {
            if (request.active()) product.activate();
            else product.deactivate();
        }

        Product saved = productRepository.save(product);
        return productMapper.toResponse(saved, categoryName);
    }
}
