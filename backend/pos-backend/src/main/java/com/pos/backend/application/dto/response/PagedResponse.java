package com.pos.backend.application.dto.response;

import java.util.List;

/**
 * Respuesta paginada genérica.
 * REQ-20: items, page, pageSize, totalItems, totalPages, hasNext, hasPrevious
 */
public record PagedResponse<T>(
    List<T> items,
    int page,
    int pageSize,
    long totalItems,
    int totalPages,
    boolean hasNext,
    boolean hasPrevious
) {
    public static <T> PagedResponse<T> of(List<T> items, int page, int pageSize, long totalItems) {
        int totalPages = pageSize > 0 ? (int) Math.ceil((double) totalItems / pageSize) : 0;
        return new PagedResponse<>(
            items, page, pageSize, totalItems, totalPages,
            page < totalPages - 1,
            page > 0
        );
    }

    public static <T> PagedResponse<T> empty(int page, int pageSize) {
        return new PagedResponse<>(List.of(), page, pageSize, 0, 0, false, false);
    }
}
