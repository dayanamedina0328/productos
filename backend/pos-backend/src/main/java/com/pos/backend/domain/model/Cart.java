package com.pos.backend.domain.model;

import com.pos.backend.domain.exception.InsufficientStockException;
import com.pos.backend.domain.model.valueobject.Money;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Entidad de dominio: Carrito de compras.
 * Sin anotaciones de Spring/JPA.
 */
public class Cart {

    private static final BigDecimal IVA_RATE = new BigDecimal("0.19");

    private final String id;
    private String customerId;
    private final Map<String, CartItem> items; // productId → CartItem
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Cart(String id, String customerId) {
        this.id = Objects.requireNonNull(id);
        this.customerId = customerId;
        this.items = new LinkedHashMap<>();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    /** Reconstruye desde persistencia */
    public static Cart reconstitute(String id, String customerId, List<CartItem> items,
                                    LocalDateTime createdAt, LocalDateTime updatedAt) {
        Cart cart = new Cart(id, customerId);
        items.forEach(item -> cart.items.put(item.getProductId(), item));
        cart.updatedAt = updatedAt;
        return cart;
    }

    /**
     * Agrega un producto al carrito.
     * Si ya existe, incrementa la cantidad.
     * Valida que la cantidad total no supere el stock disponible.
     */
    public void addItem(String itemId, Product product, int quantity) {
        if (!product.isAvailable()) {
            throw new com.pos.backend.domain.exception.ProductNotAvailableException(product.getId());
        }

        CartItem existing = items.get(product.getId());
        int currentQty = existing != null ? existing.getQuantity() : 0;
        int totalQty = currentQty + quantity;

        if (totalQty > product.getStock()) {
            throw new InsufficientStockException(product.getId(), product.getName(), totalQty, product.getStock());
        }

        if (existing != null) {
            existing.increaseQuantity(quantity);
        } else {
            items.put(product.getId(), new CartItem(itemId, product.getId(), product.getName(),
                                                     product.getSku(), quantity, product.getPrice()));
        }
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Elimina un ítem del carrito por productId.
     */
    public void removeItem(String productId) {
        if (!items.containsKey(productId)) {
            throw new com.pos.backend.domain.exception.CartNotFoundException(
                "Item with productId '" + productId + "' not found in cart '" + id + "'");
        }
        items.remove(productId);
        this.updatedAt = LocalDateTime.now();
    }

    public void clear() {
        items.clear();
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }

    public Money getSubtotal() {
        return items.values().stream()
                    .map(CartItem::getSubtotal)
                    .reduce(Money.ZERO, Money::add);
    }

    public Money getTax() {
        BigDecimal subtotal = getSubtotal().amount();
        BigDecimal tax = subtotal.multiply(IVA_RATE).setScale(2, RoundingMode.HALF_UP);
        return Money.of(tax);
    }

    public Money getTotal() {
        return getSubtotal().add(getTax());
    }

    // Getters
    public String getId() { return id; }
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public Collection<CartItem> getItems() { return Collections.unmodifiableCollection(items.values()); }
    public int getItemCount() { return items.size(); }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
