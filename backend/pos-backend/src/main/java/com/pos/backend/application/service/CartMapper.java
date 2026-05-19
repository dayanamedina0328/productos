package com.pos.backend.application.service;

import com.pos.backend.application.dto.response.CartItemResponse;
import com.pos.backend.application.dto.response.CartResponse;
import com.pos.backend.domain.model.Cart;
import com.pos.backend.domain.model.CartItem;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CartMapper {

    public CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
            .map(this::toItemResponse)
            .toList();

        return new CartResponse(
            cart.getId(),
            cart.getCustomerId(),
            items,
            cart.getSubtotal().amount(),
            cart.getTax().amount(),
            cart.getTotal().amount(),
            cart.getCreatedAt(),
            cart.getUpdatedAt()
        );
    }

    private CartItemResponse toItemResponse(CartItem item) {
        return new CartItemResponse(
            item.getId(),
            item.getProductId(),
            item.getProductName(),
            item.getProductSku(),
            item.getQuantity(),
            item.getUnitPrice(),
            item.getDiscount(),
            item.getSubtotal().amount()
        );
    }
}
