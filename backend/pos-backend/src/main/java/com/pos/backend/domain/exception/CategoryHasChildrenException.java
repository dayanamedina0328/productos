package com.pos.backend.domain.exception;

public class CategoryHasChildrenException extends DomainException {
    public CategoryHasChildrenException(String categoryId) {
        super("CATEGORY_HAS_CHILDREN", "Category '" + categoryId + "' cannot be deleted because it has child categories");
    }
}
