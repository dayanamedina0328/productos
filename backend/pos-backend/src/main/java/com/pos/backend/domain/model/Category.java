package com.pos.backend.domain.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * Entidad de dominio: Categoría de productos.
 * Soporta jerarquía padre-hijo.
 * Sin anotaciones de Spring/JPA.
 */
public class Category {

    private final String id;
    private String name;
    private String description;
    private final String parentId;
    private final int level;
    private boolean active;
    private final List<Category> children;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Category(String id, String name, String description, String parentId,
                     int level, boolean active, LocalDateTime createdAt) {
        this.id = Objects.requireNonNull(id, "Category id cannot be null");
        this.name = Objects.requireNonNull(name, "Category name cannot be null");
        this.description = description;
        this.parentId = parentId;
        this.level = level;
        this.active = active;
        this.children = new ArrayList<>();
        this.createdAt = createdAt;
        this.updatedAt = createdAt;
    }

    /** Factory method para crear una categoría raíz */
    public static Category createRoot(String id, String name, String description) {
        validateName(name);
        return new Category(id, name, description, null, 0, true, LocalDateTime.now());
    }

    /** Factory method para crear una subcategoría */
    public static Category createChild(String id, String name, String description,
                                       String parentId, int parentLevel) {
        validateName(name);
        Objects.requireNonNull(parentId, "Parent id cannot be null for child category");
        return new Category(id, name, description, parentId, parentLevel + 1, true, LocalDateTime.now());
    }

    /** Reconstruye desde persistencia */
    public static Category reconstitute(String id, String name, String description,
                                        String parentId, int level, boolean active,
                                        LocalDateTime createdAt, LocalDateTime updatedAt) {
        Category cat = new Category(id, name, description, parentId, level, active, createdAt);
        cat.updatedAt = updatedAt;
        return cat;
    }

    private static void validateName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Category name cannot be blank");
        }
        if (name.length() > 100) {
            throw new IllegalArgumentException("Category name cannot exceed 100 characters");
        }
    }

    public boolean isRoot() {
        return parentId == null;
    }

    public boolean hasChildren() {
        return !children.isEmpty();
    }

    public void addChild(Category child) {
        children.add(child);
    }

    public void update(String name, String description) {
        validateName(name);
        this.name = name;
        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }

    public void deactivate() {
        this.active = false;
        this.updatedAt = LocalDateTime.now();
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getParentId() { return parentId; }
    public int getLevel() { return level; }
    public boolean isActive() { return active; }
    public List<Category> getChildren() { return Collections.unmodifiableList(children); }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
