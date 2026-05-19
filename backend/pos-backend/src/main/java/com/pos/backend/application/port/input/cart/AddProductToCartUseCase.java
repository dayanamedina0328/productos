package com.pos.backend.application.port.input.cart;

import com.pos.backend.application.dto.request.AddToCartRequest;
import com.pos.backend.application.dto.response.CartResponse;

public interface AddProductToCartUseCase {
    CartResponse execute(String cartId, AddToCartRequest request);
}
