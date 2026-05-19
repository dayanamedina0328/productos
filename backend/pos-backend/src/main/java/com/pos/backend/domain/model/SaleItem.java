package com.pos.backend.domain.model;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Entidad de dominio: Ítem de una venta.
 * Sin anotaciones de Spring/JPA.
 */
public class SaleItem {

    private final String id;
    private final String productId;
    private final String productName;
    private final String productSku;
    private final int quantity;
    private final BigDecimal unitPrice;
    private final BigDecimal discount;
    private final BigDecimal subtotal;

    public SaleItem(String id, String productId, String productName, String productSku,
                    int quantity, BigDecimal unitPrice, BigDecimal discount) {
        this.id = Objects.requireNonNull(id);
        this.productId = Objects.requireNonNull(productId);
        this.productName = Objects.requireNonNull(productName);
        this.productSku = Objects.requireNonNull(productSku);
        if (quantity < 1) throw new IllegalArgumentException("Quantity must be >= 1");
        this.quantity = quantity;
        this.unitPrice = Objects.requireNonNull(unitPrice);
        this.discount = discount != null ? discount : BigDecimal.ZERO;
        this.subtotal = unitPrice.multiply(BigDecimal.valueOf(quantity)).subtract(this.discount);
    }

    /** Crea un SaleItem desde un CartItem */
    public static SaleItem fromCartItem(String id, CartItem cartItem) {
        return new SaleItem(id, cartItem.getProductId(), cartItem.getProductName(),
                            cartItem.getProductSku(), cartItem.getQuantity(),
                            cartItem.getUnitPrice(), cartItem.getDiscount());
    }

    // Getters
    public String getId() { return id; }
    public String getProductId() { return productId; }
    public String getProductName() { return productName; }
    public String getProductSku() { return productSku; }
    public int getQuantity() { return quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public BigDecimal getDiscount() { return discount; }
    public BigDecimal getSubtotal() { return subtotal; }
}
