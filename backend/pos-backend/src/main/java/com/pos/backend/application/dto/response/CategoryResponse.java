package com.pos.backend.application.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record CategoryResponse(
    String id,
    String name,
    String description,
    String parentId,
    int level,
    boolean active,
    List<CategoryResponse> children,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
