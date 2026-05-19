package com.pos.backend.application.dto.response;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Respuesta de error estándar.
 * REQ-19: code, message, timestamp
 */
public record ApiErrorResponse(
    String code,
    String message,
    LocalDateTime timestamp,
    List<FieldError> errors
) {
    public record FieldError(String field, String message) {}

    public static ApiErrorResponse of(String code, String message) {
        return new ApiErrorResponse(code, message, LocalDateTime.now(), null);
    }

    public static ApiErrorResponse withErrors(String code, String message, List<FieldError> errors) {
        return new ApiErrorResponse(code, message, LocalDateTime.now(), errors);
    }
}
