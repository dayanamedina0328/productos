package com.pos.backend.infrastructure.persistence.adapter;

import com.pos.backend.domain.model.Product;
import com.pos.backend.domain.port.output.ProductRepository;
import com.pos.backend.infrastructure.persistence.entity.CategoryEntity;
import com.pos.backend.infrastructure.persistence.entity.ProductEntity;
import com.pos.backend.infrastructure.persistence.jpa.JpaCategoryRepository;
import com.pos.backend.infrastructure.persistence.jpa.JpaProductRepository;
import com.pos.backend.infrastructure.persistence.mapper.ProductEntityMapper;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class ProductRepositoryAdapter implements ProductRepository {

    private final JpaProductRepository jpaRepository;
    private final JpaCategoryRepository jpaCategoryRepository;
    private final ProductEntityMapper mapper;

    public ProductRepositoryAdapter(JpaProductRepository jpaRepository,
                                    JpaCategoryRepository jpaCategoryRepository,
                                    ProductEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.jpaCategoryRepository = jpaCategoryRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Product> findById(String id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<Product> findBySku(String sku) {
        return jpaRepository.findBySku(sku).map(mapper::toDomain);
    }

    @Override
    public List<Product> findAll(ProductFilter filter, int page, int pageSize) {
        Page<ProductEntity> result = jpaRepository.findAll(
            buildSpec(filter), PageRequest.of(page, pageSize));
        return result.getContent().stream().map(mapper::toDomain).toList();
    }

    @Override
    public long countAll(ProductFilter filter) {
        return jpaRepository.count(buildSpec(filter));
    }

    @Override
    public Product save(Product product) {
        CategoryEntity category = jpaCategoryRepository.findById(product.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found: " + product.getCategoryId()));
        ProductEntity entity = mapper.toEntity(product, category);
        return mapper.toDomain(jpaRepository.save(entity));
    }

    @Override
    public void deleteById(String id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsBySku(String sku) {
        return jpaRepository.existsBySku(sku);
    }

    @Override
    public boolean existsBySkuAndIdNot(String sku, String excludeId) {
        return jpaRepository.existsBySkuAndIdNot(sku, excludeId);
    }

    @Override
    public List<Product> findLowStockProducts() {
        return jpaRepository.findLowStockProducts().stream().map(mapper::toDomain).toList();
    }

    @Override
    public boolean hasSaleHistory(String productId) {
        return jpaRepository.hasSaleHistory(productId);
    }

    private Specification<ProductEntity> buildSpec(ProductFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filter.categoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), filter.categoryId()));
            }
            if (filter.name() != null && !filter.name().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")),
                                       "%" + filter.name().toLowerCase() + "%"));
            }
            if (filter.active() != null) {
                predicates.add(cb.equal(root.get("active"), filter.active()));
            }
            if (filter.lowStock() != null) {
                predicates.add(cb.equal(root.get("lowStock"), filter.lowStock()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
