package com.pos.backend.domain.model.valueobject;

import java.util.Objects;
import java.util.regex.Pattern;

/**
 * Value object para el SKU (Stock Keeping Unit).
 * Máximo 50 caracteres, alfanumérico con guiones.
 */
public record Sku(String value) {

    private static final int MAX_LENGTH = 50;
    private static final Pattern VALID_PATTERN = Pattern.compile("^[A-Z0-9\\-]{1,50}$");

    public Sku {
        Objects.requireNonNull(value, "SKU cannot be null");
        String normalized = value.trim().toUpperCase();
        if (normalized.isEmpty()) {
            throw new IllegalArgumentException("SKU cannot be empty");
        }
        if (normalized.length() > MAX_LENGTH) {
            throw new IllegalArgumentException("SKU cannot exceed " + MAX_LENGTH + " characters: " + value);
        }
        if (!VALID_PATTERN.matcher(normalized).matches()) {
            throw new IllegalArgumentException("SKU must be alphanumeric (A-Z, 0-9, hyphens): " + value);
        }
        value = normalized;
    }

    public static Sku of(String value) {
        return new Sku(value);
    }

    public static boolean isValid(String value) {
        if (value == null || value.isBlank()) return false;
        String normalized = value.trim().toUpperCase();
        return normalized.length() <= MAX_LENGTH && VALID_PATTERN.matcher(normalized).matches();
    }

    @Override
    public String toString() {
        return value;
    }
}
