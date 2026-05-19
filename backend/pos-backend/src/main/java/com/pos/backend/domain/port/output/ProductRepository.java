package com.pos.backend.domain.port.output;

import com.pos.backend.domain.model.Product;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de salida: repositorio de productos.
 * Definido en el dominio, implementado en infraestructura.
 */
public interface ProductRepository {

    Optional<Product> findById(String id);

    Optional<Product> findBySku(String sku);

    List<Product> findAll(ProductFilter filter, int page, int pageSize);

    long countAll(ProductFilter filter);

    Product save(Product product);

    void deleteById(String id);

    boolean existsBySku(String sku);

    boolean existsBySkuAndIdNot(String sku, String excludeId);

    List<Product> findLowStockProducts();

    boolean hasSaleHistory(String productId);

    record ProductFilter(String categoryId, String name, Boolean active, Boolean lowStock) {
        public static ProductFilter empty() {
            return new ProductFilter(null, null, null, null);
        }
    }
}
