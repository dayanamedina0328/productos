package com.pos.backend.application.service;

import com.pos.backend.application.dto.request.CreateProductRequest;
import com.pos.backend.application.dto.response.ProductResponse;
import com.pos.backend.application.port.input.product.CreateProductUseCase;
import com.pos.backend.domain.exception.CategoryNotFoundException;
import com.pos.backend.domain.exception.DuplicateSkuException;
import com.pos.backend.domain.model.Category;
import com.pos.backend.domain.model.Product;
import com.pos.backend.domain.port.output.CategoryRepository;
import com.pos.backend.domain.port.output.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class CreateProductService implements CreateProductUseCase {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    public CreateProductService(ProductRepository productRepository,
                                CategoryRepository categoryRepository,
                                ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productMapper = productMapper;
    }

    @Override
    public ProductResponse execute(CreateProductRequest request) {
        // Validar SKU único
        if (productRepository.existsBySku(request.sku())) {
            throw new DuplicateSkuException(request.sku());
        }

        // Validar que la categoría existe
        Category category = categoryRepository.findById(request.categoryId())
            .orElseThrow(() -> new CategoryNotFoundException(request.categoryId()));

        // Crear entidad de dominio
        Product product = Product.create(
            UUID.randomUUID().toString(),
            request.sku(),
            request.name(),
            request.description(),
            request.price(),
            request.cost(),
            request.stock() != null ? request.stock() : 0,
            request.minStock() != null ? request.minStock() : 0,
            request.categoryId(),
            request.imageUrl()
        );

        Product saved = productRepository.save(product);
        return productMapper.toResponse(saved, category.getName());
    }
}
