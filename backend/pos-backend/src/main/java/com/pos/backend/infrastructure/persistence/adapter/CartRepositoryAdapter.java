package com.pos.backend.infrastructure.persistence.adapter;

import com.pos.backend.domain.model.Cart;
import com.pos.backend.domain.model.CartItem;
import com.pos.backend.domain.port.output.CartRepository;
import com.pos.backend.infrastructure.persistence.entity.CartEntity;
import com.pos.backend.infrastructure.persistence.entity.CartItemEntity;
import com.pos.backend.infrastructure.persistence.repository.JpaCartRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementación JPA del CartRepository.
 * Persiste carritos en base de datos PostgreSQL.
 */
@Component
public class CartRepositoryAdapter implements CartRepository {

    private final JpaCartRepository jpaCartRepository;

    public CartRepositoryAdapter(JpaCartRepository jpaCartRepository) {
        this.jpaCartRepository = jpaCartRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Cart> findById(String id) {
        return jpaCartRepository.findById(id)
            .map(this::toDomain);
    }

    @Override
    @Transactional
    public Cart save(Cart cart) {
        CartEntity entity = jpaCartRepository.findById(cart.getId())
            .orElse(new CartEntity(cart.getId(), cart.getCustomerId()));
        
        entity.setCustomerId(cart.getCustomerId());
        
        // Clear existing items
        entity.getItems().clear();
        
        // Add new items
        for (CartItem item : cart.getItems()) {
            CartItemEntity itemEntity = new CartItemEntity(
                item.getId(),
                entity,
                item.getProductId(),
                item.getProductName(),
                item.getProductSku(),
                item.getQuantity(),
                item.getUnitPrice()
            );
            entity.getItems().add(itemEntity);
        }
        
        CartEntity saved = jpaCartRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    @Transactional
    public void deleteById(String id) {
        jpaCartRepository.deleteById(id);
    }

    private Cart toDomain(CartEntity entity) {
        List<CartItem> items = entity.getItems().stream()
            .map(item -> new CartItem(
                item.getId(),
                item.getProductId(),
                item.getProductName(),
                item.getProductSku(),
                item.getQuantity(),
                item.getUnitPrice()
            ))
            .collect(Collectors.toList());
        
        return Cart.reconstitute(
            entity.getId(),
            entity.getCustomerId(),
            items,
            entity.getCreatedAt(),
            entity.getUpdatedAt()
        );
    }
}
