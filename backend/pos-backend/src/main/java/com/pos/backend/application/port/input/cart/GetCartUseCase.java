package com.pos.backend.application.port.input.cart;

import com.pos.backend.application.dto.response.CartResponse;

public interface GetCartUseCase {
    CartResponse getCart(String cartId);
}
