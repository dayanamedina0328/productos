package com.pos.backend.domain.model;

import com.pos.backend.domain.exception.InsufficientStockException;
import com.pos.backend.domain.model.valueobject.Money;
import com.pos.backend.domain.model.valueobject.Sku;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Entidad de dominio: Producto.
 * Sin anotaciones de Spring/JPA.
 */
public class Product {

    private final String id;
    private Sku sku;
    private String name;
    private String description;
    private Money price;
    private Money cost;
    private int stock;
    private int minStock;
    private String categoryId;
    private String imageUrl;
    private boolean active;
    private boolean lowStock;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Product(String id, Sku sku, String name, String description,
                    Money price, Money cost, int stock, int minStock,
                    String categoryId, String imageUrl, boolean active,
                    LocalDateTime createdAt) {
        this.id = Objects.requireNonNull(id);
        this.sku = Objects.requireNonNull(sku);
        this.name = Objects.requireNonNull(name);
        this.description = description;
        this.price = Objects.requireNonNull(price);
        this.cost = Objects.requireNonNull(cost);
        this.stock = stock;
        this.minStock = minStock;
        this.categoryId = Objects.requireNonNull(categoryId);
        this.imageUrl = imageUrl;
        this.active = active;
        this.lowStock = stock <= minStock;
        this.createdAt = createdAt;
        this.updatedAt = createdAt;
    }

    /** Factory method para crear un nuevo producto */
    public static Product create(String id, String sku, String name, String description,
                                 BigDecimal price, BigDecimal cost, int stock, int minStock,
                                 String categoryId, String imageUrl) {
        validateName(name);
        if (stock < 0) throw new IllegalArgumentException("Stock cannot be negative");
        if (minStock < 0) throw new IllegalArgumentException("Min stock cannot be negative");

        return new Product(id, Sku.of(sku), name, description,
                           Money.of(price), Money.of(cost != null ? cost : BigDecimal.ZERO),
                           stock, minStock, categoryId, imageUrl, true, LocalDateTime.now());
    }

    /** Reconstruye desde persistencia */
    public static Product reconstitute(String id, String sku, String name, String description,
                                       BigDecimal price, BigDecimal cost, int stock, int minStock,
                                       String categoryId, String imageUrl, boolean active,
                                       LocalDateTime createdAt, LocalDateTime updatedAt) {
        Product p = new Product(id, Sku.of(sku), name, description,
                                Money.of(price), Money.of(cost), stock, minStock,
                                categoryId, imageUrl, active, createdAt);
        p.updatedAt = updatedAt;
        p.lowStock = stock <= minStock;
        return p;
    }

    private static void validateName(String name) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Product name cannot be blank");
        if (name.length() > 255) throw new IllegalArgumentException("Product name cannot exceed 255 characters");
    }

    public boolean isAvailable() {
        return active && stock > 0;
    }

    public boolean isLowStock() {
        return stock <= minStock;
    }

    public BigDecimal getProfitMargin() {
        if (price.isZero()) return BigDecimal.ZERO;
        return price.subtract(cost).amount()
                    .divide(price.amount(), 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
    }

    public void decreaseStock(int quantity) {
        if (quantity <= 0) throw new IllegalArgumentException("Quantity to decrease must be positive");
        if (stock < quantity) {
            throw new InsufficientStockException(id, name, quantity, stock);
        }
        this.stock -= quantity;
        this.lowStock = this.stock <= this.minStock;
        this.updatedAt = LocalDateTime.now();
    }

    public void increaseStock(int quantity) {
        if (quantity <= 0) throw new IllegalArgumentException("Quantity to increase must be positive");
        this.stock += quantity;
        this.lowStock = this.stock <= this.minStock;
        this.updatedAt = LocalDateTime.now();
    }

    public void activate() {
        this.active = true;
        this.updatedAt = LocalDateTime.now();
    }

    public void deactivate() {
        this.active = false;
        this.updatedAt = LocalDateTime.now();
    }

    public void update(String sku, String name, String description, BigDecimal price,
                       BigDecimal cost, int stock, int minStock, String categoryId, String imageUrl) {
        if (sku != null) this.sku = Sku.of(sku);
        if (name != null) { validateName(name); this.name = name; }
        if (description != null) this.description = description;
        if (price != null) this.price = Money.of(price);
        if (cost != null) this.cost = Money.of(cost);
        if (stock >= 0) { this.stock = stock; }
        if (minStock >= 0) { this.minStock = minStock; }
        if (categoryId != null) this.categoryId = categoryId;
        if (imageUrl != null) this.imageUrl = imageUrl;
        this.lowStock = this.stock <= this.minStock;
        this.updatedAt = LocalDateTime.now();
    }

    // Getters
    public String getId() { return id; }
    public String getSku() { return sku.value(); }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price.amount(); }
    public BigDecimal getCost() { return cost.amount(); }
    public int getStock() { return stock; }
    public int getMinStock() { return minStock; }
    public String getCategoryId() { return categoryId; }
    public String getImageUrl() { return imageUrl; }
    public boolean isActive() { return active; }
    public boolean getLowStock() { return lowStock; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
