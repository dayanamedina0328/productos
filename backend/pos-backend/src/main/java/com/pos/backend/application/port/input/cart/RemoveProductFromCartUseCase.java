package com.pos.backend.application.port.input.cart;

import com.pos.backend.application.dto.response.CartResponse;

public interface RemoveProductFromCartUseCase {
    CartResponse execute(String cartId, String productId);
}
