package com.pos.backend.application.service;

import com.pos.backend.application.dto.response.PagedResponse;
import com.pos.backend.application.dto.response.ProductResponse;
import com.pos.backend.application.port.input.product.GetProductByIdUseCase;
import com.pos.backend.application.port.input.product.GetProductsUseCase;
import com.pos.backend.domain.exception.ProductNotFoundException;
import com.pos.backend.domain.model.Category;
import com.pos.backend.domain.model.Product;
import com.pos.backend.domain.port.output.CategoryRepository;
import com.pos.backend.domain.port.output.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class GetProductsService implements GetProductsUseCase, GetProductByIdUseCase {

    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int MAX_PAGE_SIZE = 100;

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    public GetProductsService(ProductRepository productRepository,
                              CategoryRepository categoryRepository,
                              ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productMapper = productMapper;
    }

    @Override
    public PagedResponse<ProductResponse> execute(String categoryId, String name, Boolean active,
                                                   Boolean lowStock, int page, int pageSize) {
        int effectivePageSize = Math.min(Math.max(pageSize, 1), MAX_PAGE_SIZE);
        int effectivePage = Math.max(page, 0);

        var filter = new ProductRepository.ProductFilter(categoryId, name, active, lowStock);
        List<Product> products = productRepository.findAll(filter, effectivePage, effectivePageSize);
        long total = productRepository.countAll(filter);

        // Cargar nombres de categorías en batch
        Map<String, String> categoryNames = loadCategoryNames(products);

        List<ProductResponse> responses = products.stream()
            .map(p -> productMapper.toResponse(p, categoryNames.getOrDefault(p.getCategoryId(), "")))
            .toList();

        return PagedResponse.of(responses, effectivePage, effectivePageSize, total);
    }

    @Override
    public ProductResponse execute(String id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ProductNotFoundException(id));

        String categoryName = categoryRepository.findById(product.getCategoryId())
            .map(Category::getName)
            .orElse("");

        return productMapper.toResponse(product, categoryName);
    }

    private Map<String, String> loadCategoryNames(List<Product> products) {
        return products.stream()
            .map(Product::getCategoryId)
            .distinct()
            .collect(Collectors.toMap(
                id -> id,
                id -> categoryRepository.findById(id).map(Category::getName).orElse(""),
                (a, b) -> a
            ));
    }
}
