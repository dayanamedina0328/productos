package com.pos.backend.infrastructure.web.controller;

import com.pos.backend.application.dto.request.AddToCartRequest;
import com.pos.backend.application.dto.response.CartResponse;
import com.pos.backend.application.port.input.cart.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/carts")
@Tag(name = "Cart", description = "Shopping cart operations")
@SecurityRequirement(name = "bearer-jwt")
public class CartController {

    private final CreateCartUseCase createCartUseCase;
    private final GetCartUseCase getCartUseCase;
    private final AddProductToCartUseCase addProductToCartUseCase;
    private final RemoveProductFromCartUseCase removeProductFromCartUseCase;

    public CartController(CreateCartUseCase createCartUseCase,
                          GetCartUseCase getCartUseCase,
                          AddProductToCartUseCase addProductToCartUseCase,
                          RemoveProductFromCartUseCase removeProductFromCartUseCase) {
        this.createCartUseCase = createCartUseCase;
        this.getCartUseCase = getCartUseCase;
        this.addProductToCartUseCase = addProductToCartUseCase;
        this.removeProductFromCartUseCase = removeProductFromCartUseCase;
    }

    @PostMapping
    @Operation(summary = "Create a new cart")
    public ResponseEntity<CartResponse> createCart(@RequestParam(required = false) String customerId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(createCartUseCase.execute(customerId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get cart by ID")
    public ResponseEntity<CartResponse> getCart(@PathVariable String id) {
        return ResponseEntity.ok(getCartUseCase.execute(id));
    }

    @PostMapping("/{id}/items")
    @Operation(summary = "Add product to cart")
    public ResponseEntity<CartResponse> addItem(@PathVariable String id,
                                                 @Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(addProductToCartUseCase.execute(id, request));
    }

    @DeleteMapping("/{id}/items/{productId}")
    @Operation(summary = "Remove product from cart")
    public ResponseEntity<CartResponse> removeItem(@PathVariable String id,
                                                    @PathVariable String productId) {
        return ResponseEntity.ok(removeProductFromCartUseCase.execute(id, productId));
    }
}
