package com.pos.backend.domain.model;

import com.pos.backend.domain.model.valueobject.Money;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Entidad de dominio: Ítem del carrito.
 * Sin anotaciones de Spring/JPA.
 */
public class CartItem {

    private final String id;
    private final String productId;
    private final String productName;
    private final String productSku;
    private int quantity;
    private final Money unitPrice;
    private Money discount;

    public CartItem(String id, String productId, String productName, String productSku,
                    int quantity, BigDecimal unitPrice) {
        this.id = Objects.requireNonNull(id);
        this.productId = Objects.requireNonNull(productId);
        this.productName = Objects.requireNonNull(productName);
        this.productSku = Objects.requireNonNull(productSku);
        if (quantity < 1) throw new IllegalArgumentException("Quantity must be >= 1");
        if (quantity > 999_999) throw new IllegalArgumentException("Quantity cannot exceed 999,999");
        this.quantity = quantity;
        this.unitPrice = Money.of(unitPrice);
        this.discount = Money.ZERO;
    }

    public void increaseQuantity(int additional) {
        int newQty = this.quantity + additional;
        if (newQty > 999_999) throw new IllegalArgumentException("Total quantity cannot exceed 999,999");
        this.quantity = newQty;
    }

    public void setQuantity(int quantity) {
        if (quantity < 1) throw new IllegalArgumentException("Quantity must be >= 1");
        if (quantity > 999_999) throw new IllegalArgumentException("Quantity cannot exceed 999,999");
        this.quantity = quantity;
    }

    public Money getSubtotal() {
        return unitPrice.multiply(quantity).subtract(discount);
    }

    // Getters
    public String getId() { return id; }
    public String getProductId() { return productId; }
    public String getProductName() { return productName; }
    public String getProductSku() { return productSku; }
    public int getQuantity() { return quantity; }
    public BigDecimal getUnitPrice() { return unitPrice.amount(); }
    public BigDecimal getDiscount() { return discount.amount(); }
}
