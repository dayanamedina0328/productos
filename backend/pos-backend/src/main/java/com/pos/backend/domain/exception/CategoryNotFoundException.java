package com.pos.backend.domain.exception;

public class CategoryNotFoundException extends DomainException {
    public CategoryNotFoundException(String id) {
        super("CATEGORY_NOT_FOUND", "Category not found with id: " + id);
    }
}
