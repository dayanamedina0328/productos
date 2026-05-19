package com.pos.backend.domain.exception;

public class CategoryHasProductsException extends DomainException {
    public CategoryHasProductsException(String categoryId) {
        super("CATEGORY_HAS_PRODUCTS", "Category '" + categoryId + "' cannot be deleted because it has associated products");
    }
}
