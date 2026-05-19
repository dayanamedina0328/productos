package com.pos.backend.infrastructure.persistence.adapter;

import com.pos.backend.domain.model.Category;
import com.pos.backend.domain.port.output.CategoryRepository;
import com.pos.backend.infrastructure.persistence.entity.CategoryEntity;
import com.pos.backend.infrastructure.persistence.jpa.JpaCategoryRepository;
import com.pos.backend.infrastructure.persistence.mapper.CategoryEntityMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class CategoryRepositoryAdapter implements CategoryRepository {

    private final JpaCategoryRepository jpaRepository;
    private final CategoryEntityMapper mapper;

    public CategoryRepositoryAdapter(JpaCategoryRepository jpaRepository,
                                     CategoryEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Category> findById(String id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Category> findAll() {
        return jpaRepository.findAll().stream().map(mapper::toDomain).toList();
    }

    @Override
    public List<Category> findByParentId(String parentId) {
        return jpaRepository.findByParentId(parentId).stream().map(mapper::toDomain).toList();
    }

    @Override
    public Category save(Category category) {
        CategoryEntity entity = mapper.toEntity(category);

        // Establecer parent si existe
        if (category.getParentId() != null) {
            jpaRepository.findById(category.getParentId())
                .ifPresent(entity::setParent);
        }

        return mapper.toDomain(jpaRepository.save(entity));
    }

    @Override
    public void deleteById(String id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean hasProducts(String categoryId) {
        return jpaRepository.hasProducts(categoryId);
    }

    @Override
    public boolean hasChildren(String categoryId) {
        return jpaRepository.hasChildren(categoryId);
    }
}
