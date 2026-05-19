package com.pos.backend.domain.port.output;

import com.pos.backend.domain.model.Category;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de salida: repositorio de categorías.
 */
public interface CategoryRepository {

    Optional<Category> findById(String id);

    List<Category> findAll();

    List<Category> findByParentId(String parentId);

    Category save(Category category);

    void deleteById(String id);

    boolean hasProducts(String categoryId);

    boolean hasChildren(String categoryId);
}
