package com.pos.backend.infrastructure.persistence.adapter;

import com.pos.backend.domain.model.Cart;
import com.pos.backend.domain.port.output.CartRepository;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Implementación en memoria del CartRepository.
 * El carrito es temporal — no necesita persistencia en base de datos para el MVP.
 * Thread-safe gracias a ConcurrentHashMap.
 */
@Component
public class CartRepositoryAdapter implements CartRepository {

    private final Map<String, Cart> store = new ConcurrentHashMap<>();

    @Override
    public Optional<Cart> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public Cart save(Cart cart) {
        store.put(cart.getId(), cart);
        return cart;
    }

    @Override
    public void deleteById(String id) {
        store.remove(id);
    }
}
