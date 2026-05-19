package com.pos.backend.infrastructure.persistence.jpa;

import com.pos.backend.infrastructure.persistence.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JpaCategoryRepository extends JpaRepository<CategoryEntity, String> {

    @Query("SELECT c FROM CategoryEntity c WHERE c.parent.id = :parentId")
    List<CategoryEntity> findByParentId(@Param("parentId") String parentId);

    @Query("SELECT COUNT(c) > 0 FROM CategoryEntity c WHERE c.parent.id = :categoryId")
    boolean hasChildren(@Param("categoryId") String categoryId);

    @Query("SELECT COUNT(p) > 0 FROM ProductEntity p WHERE p.category.id = :categoryId")
    boolean hasProducts(@Param("categoryId") String categoryId);
}
