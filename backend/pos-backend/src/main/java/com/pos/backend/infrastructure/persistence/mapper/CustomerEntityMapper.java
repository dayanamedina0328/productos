package com.pos.backend.infrastructure.persistence.mapper;

import com.pos.backend.domain.model.Customer;
import com.pos.backend.infrastructure.persistence.entity.CustomerEntity;
import org.springframework.stereotype.Component;

@Component
public class CustomerEntityMapper {

    public Customer toDomain(CustomerEntity entity) {
        return Customer.reconstitute(
            entity.getId(),
            entity.getName(),
            entity.getNit(),
            entity.getEmail(),
            entity.getPhone(),
            entity.getAddress(),
            entity.getCustomerType(),
            entity.getCreditLimit(),
            entity.isActive(),
            entity.getCreatedAt(),
            entity.getUpdatedAt()
        );
    }

    public CustomerEntity toEntity(Customer domain) {
        return CustomerEntity.builder()
            .id(domain.getId())
            .name(domain.getName())
            .nit(domain.getNit())
            .email(domain.getEmail())
            .phone(domain.getPhone())
            .address(domain.getAddress())
            .customerType(domain.getCustomerType())
            .creditLimit(domain.getCreditLimit())
            .active(domain.isActive())
            .build();
    }
}
