package com.pos.backend.application.service;

import com.pos.backend.application.dto.response.SaleItemResponse;
import com.pos.backend.application.dto.response.SaleResponse;
import com.pos.backend.domain.model.Sale;
import com.pos.backend.domain.model.SaleItem;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SaleMapper {

    public SaleResponse toResponse(Sale sale) {
        List<SaleItemResponse> items = sale.getItems().stream()
            .map(this::toItemResponse)
            .toList();

        return new SaleResponse(
            sale.getId(),
            sale.getInvoiceNumber(),
            sale.getCustomerId(),
            sale.getCreatedBy(),
            items,
            sale.getSubtotal(),
            sale.getTax(),
            sale.getDiscount(),
            sale.getTotal(),
            sale.getPaymentMethod(),
            sale.getPaymentDetails(),
            sale.getStatus(),
            sale.getCreatedAt(),
            sale.getUpdatedAt()
        );
    }

    private SaleItemResponse toItemResponse(SaleItem item) {
        return new SaleItemResponse(
            item.getId(),
            item.getProductId(),
            item.getProductName(),
            item.getProductSku(),
            item.getQuantity(),
            item.getUnitPrice(),
            item.getDiscount(),
            item.getSubtotal()
        );
    }
}
