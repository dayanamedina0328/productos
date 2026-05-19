package com.pos.backend.domain.port.output;

import com.pos.backend.domain.model.Cart;

import java.util.Optional;

/**
 * Puerto de salida: repositorio de carritos.
 */
public interface CartRepository {

    Optional<Cart> findById(String id);

    Cart save(Cart cart);

    void deleteById(String id);
}
