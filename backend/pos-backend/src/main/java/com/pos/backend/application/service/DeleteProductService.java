package com.pos.backend.application.service;

import com.pos.backend.application.port.input.product.DeleteProductUseCase;
import com.pos.backend.domain.exception.ProductNotFoundException;
import com.pos.backend.domain.model.Product;
import com.pos.backend.domain.port.output.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DeleteProductService implements DeleteProductUseCase {

    private final ProductRepository productRepository;

    public DeleteProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void execute(String id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ProductNotFoundException(id));

        if (productRepository.hasSaleHistory(id)) {
            // Soft delete: desactivar el producto
            product.deactivate();
            productRepository.save(product);
        } else {
            // Hard delete: eliminar completamente
            productRepository.deleteById(id);
        }
    }
}
