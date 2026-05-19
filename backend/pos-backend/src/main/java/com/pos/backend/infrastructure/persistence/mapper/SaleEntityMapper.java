package com.pos.backend.infrastructure.persistence.mapper;

import com.pos.backend.domain.model.Sale;
import com.pos.backend.domain.model.SaleItem;
import com.pos.backend.infrastructure.persistence.entity.SaleEntity;
import com.pos.backend.infrastructure.persistence.entity.SaleItemEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class SaleEntityMapper {

    public Sale toDomain(SaleEntity entity) {
        List<SaleItem> items = entity.getItems().stream()
            .map(this::itemToDomain)
            .toList();

        return Sale.reconstitute(
            entity.getId(),
            entity.getInvoiceNumber(),
            entity.getCustomerId(),
            entity.getCreatedBy(),
            items,
            entity.getSubtotal(),
            entity.getTax(),
            entity.getDiscount(),
            entity.getTotal(),
            entity.getPaymentMethod(),
            entity.getPaymentDetails(),
            entity.getStatus(),
            entity.getCreatedAt(),
            entity.getUpdatedAt()
        );
    }

    private SaleItem itemToDomain(SaleItemEntity entity) {
        return new SaleItem(
            entity.getId(),
            entity.getProductId(),
            "", // productName se carga por separado si se necesita
            "", // productSku se carga por separado si se necesita
            entity.getQuantity(),
            entity.getUnitPrice(),
            entity.getDiscount()
        );
    }

    public SaleEntity toEntity(Sale domain) {
        SaleEntity entity = SaleEntity.builder()
            .id(domain.getId())
            .invoiceNumber(domain.getInvoiceNumber())
            .customerId(domain.getCustomerId())
            .createdBy(domain.getCreatedBy())
            .subtotal(domain.getSubtotal())
            .tax(domain.getTax())
            .discount(domain.getDiscount())
            .total(domain.getTotal())
            .paymentMethod(domain.getPaymentMethod())
            .paymentDetails(domain.getPaymentDetails())
            .status(domain.getStatus())
            .build();

        List<SaleItemEntity> itemEntities = domain.getItems().stream()
            .map(item -> itemToEntity(item, entity))
            .toList();
        entity.setItems(itemEntities);

        return entity;
    }

    private SaleItemEntity itemToEntity(SaleItem item, SaleEntity saleEntity) {
        return SaleItemEntity.builder()
            .id(item.getId() != null ? item.getId() : UUID.randomUUID().toString())
            .sale(saleEntity)
            .productId(item.getProductId())
            .quantity(item.getQuantity())
            .unitPrice(item.getUnitPrice())
            .discount(item.getDiscount())
            .subtotal(item.getSubtotal())
            .build();
    }
}
