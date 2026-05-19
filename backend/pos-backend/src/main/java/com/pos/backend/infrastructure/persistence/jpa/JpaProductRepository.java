package com.pos.backend.infrastructure.persistence.jpa;

import com.pos.backend.infrastructure.persistence.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface JpaProductRepository extends JpaRepository<ProductEntity, String>,
                                              JpaSpecificationExecutor<ProductEntity> {

    Optional<ProductEntity> findBySku(String sku);

    boolean existsBySku(String sku);

    boolean existsBySkuAndIdNot(String sku, String id);

    @Query("SELECT p FROM ProductEntity p WHERE p.lowStock = true AND p.active = true")
    List<ProductEntity> findLowStockProducts();

    @Query("SELECT COUNT(si) > 0 FROM SaleItemEntity si WHERE si.productId = :productId")
    boolean hasSaleHistory(@Param("productId") String productId);
}
