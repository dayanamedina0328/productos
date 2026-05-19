package com.pos.backend.application.service;

import com.pos.backend.application.dto.request.AddToCartRequest;
import com.pos.backend.application.dto.response.CartResponse;
import com.pos.backend.application.port.input.cart.*;
import com.pos.backend.domain.exception.CartNotFoundException;
import com.pos.backend.domain.exception.ProductNotFoundException;
import com.pos.backend.domain.model.Cart;
import com.pos.backend.domain.model.Product;
import com.pos.backend.domain.port.output.CartRepository;
import com.pos.backend.domain.port.output.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class CartService implements CreateCartUseCase, GetCartUseCase,
                                    AddProductToCartUseCase, RemoveProductFromCartUseCase {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CartMapper cartMapper;

    public CartService(CartRepository cartRepository,
                       ProductRepository productRepository,
                       CartMapper cartMapper) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.cartMapper = cartMapper;
    }

    @Override
    public CartResponse createCart(String customerId) {
        Cart cart = new Cart(UUID.randomUUID().toString(), customerId);
        Cart saved = cartRepository.save(cart);
        return cartMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(String cartId) {
        Cart cart = cartRepository.findById(cartId)
            .orElseThrow(() -> new CartNotFoundException(cartId));
        return cartMapper.toResponse(cart);
    }

    @Override
    public CartResponse addProduct(String cartId, AddToCartRequest request) {
        Cart cart = cartRepository.findById(cartId)
            .orElseThrow(() -> new CartNotFoundException(cartId));

        Product product = productRepository.findById(request.productId())
            .orElseThrow(() -> new ProductNotFoundException(request.productId()));

        cart.addItem(UUID.randomUUID().toString(), product, request.quantity());
        Cart saved = cartRepository.save(cart);
        return cartMapper.toResponse(saved);
    }

    @Override
    public CartResponse removeProduct(String cartId, String productId) {
        Cart cart = cartRepository.findById(cartId)
            .orElseThrow(() -> new CartNotFoundException(cartId));

        cart.removeItem(productId);
        Cart saved = cartRepository.save(cart);
        return cartMapper.toResponse(saved);
    }
}
